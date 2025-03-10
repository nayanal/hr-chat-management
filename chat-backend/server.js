/* ========================
   Backend: Node.js + Express 
   ======================== */

   require('dotenv').config();
   const express = require('express');
   const cors = require('cors');
   const bodyParser = require('body-parser');
   const { Pool } = require('pg');
   const bcrypt = require('bcrypt');
   const jwt = require('jsonwebtoken');
   const WebSocket = require('ws');
   const multer = require('multer');
   const path = require('path');
   
   const app = express();
   app.use(cors());
   app.use(bodyParser.json());
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   
   const pool = new Pool({
     user: process.env.DB_USER,
     host: process.env.DB_HOST,
     database: process.env.DB_NAME,
     password: process.env.DB_PASSWORD,
     port: process.env.DB_PORT || 5432,
   });
   pool.connect()
  .then(() => console.log('Database Connected Successfully'))
  .catch((err) => console.error('Database Connection Failed:', err.message));
   const wss = new WebSocket.Server({ port: 8080 });
   

   
   function broadcastMessage(message) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  // Update WebSocket to Handle Incoming Messages
  wss.on('connection', (ws) => {
    console.log('Client connected');
  
    ws.on('message', (message) => {
      const newMessage = JSON.parse(message);
      console.log("NEW MESG_____________________________");
      console.log(newMessage);
      // Save the message to database
      pool.query(
        'INSERT INTO messages (chat_id, sender, message) VALUES ($1, $2, $3)',
        [newMessage.chat_id, newMessage.sender, newMessage.message]
      )
      .then(() => {
        console.log('Message saved to database');
        broadcastMessage(newMessage); // Broadcast message to all connected clients
      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });
    });
  
    ws.on('close', () => console.log('Client disconnected'));
  });
  
   // User Authentication
   app.post('/register', async (req, res) => {
     const { username, password } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);
     await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
     res.status(201).json({ message: 'User registered successfully' });
   });
   
   app.post('/login', async (req, res) => {
     const { username, password } = req.body;
     const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
     if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password)) {
       const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET);
       res.json({ token });
     } else {
       res.status(401).json({ message: 'Invalid credentials' });
     }
   });
   
   
   app.post('/chats', async (req, res) => {
     const { user_id, platform, message } = req.body;
     const result = await pool.query('INSERT INTO chats (user_id, platform, message, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *', 
       [user_id, platform, message]);
     
     const newMessage = result.rows[0];
     broadcastMessage(newMessage);
     res.status(201).json(newMessage);
   });
   
   // File Upload
   const storage = multer.diskStorage({
     destination: './uploads/',
     filename: (req, file, cb) => {
       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
     },
   });
   const upload = multer({ storage });
   
   app.post('/upload', upload.single('file'), (req, res) => {
     res.json({ filePath: `/uploads/${req.file.filename}` });
   });
app.get('/chats', async (req, res) => {
    try {
      let query = 'SELECT * FROM chats WHERE 1=1';
      let values = [];
  
      if (req.query.platform) {
        query += ' AND platform = $1';
        values.push(req.query.platform);
      }
      if (req.query.status) {
        query += ' AND status = $2';
        values.push(req.query.status);
      }
      if (req.query.pendingReplies === 'true') {
        query += ' AND last_message_date < NOW() - INTERVAL "2 days"';
      }
  
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  app.post('/messages', async (req, res) => {
    try {
      const { chat_id, sender, message } = req.body;
      const newMessage = { chat_id, sender, message };
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newMessage));
        }
      });
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
 // Fetch messages for a specific chat
app.get('/chats/:chatId', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
        [req.params.chatId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put('/chats/:chatId', async (req, res) => {
    try {
      const { notes, job_type } = req.body;
      await pool.query('UPDATE chats SET notes = $1, job_type = $2 WHERE id = $3', [notes, job_type, req.params.chatId]);
      res.json({ message: 'Chat updated successfully' });
    } catch (error) {
      console.error('Error updating chat:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
   app.listen(5000, () => console.log('Server running on port 5000'));
   
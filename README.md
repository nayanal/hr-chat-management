# hr-chat-management
Chat Management App - Documentation

Project Overview

The Chat Management App is a multi-user communication platform designed for HR teams to manage job proposal interactions across multiple platforms like Upwork. The system provides a unified chat dashboard (UniBox), allowing HRs to:
•	Monitor all conversations across different platforms.
•	Filter chats based on job type, follow-up dates, and pending replies.
•	Communicate with job applicants in real-time.
________________________________________
Technologies Used

•	Frontend: React.js
•	Backend: Node.js, Express.js
•	Database: PostgreSQL
•	Real-time Communication: WebSockets
•	Styling: CSS
________________________________________
Project Setup & Installation

1Install & Run the Backend (Node.js + Express)
 cd backend
 
 npm install  # Install dependencies
 npm start    # Start the backend server (default port: 5000)
2.Install & Run the Frontend (React.js)

 cd frontend
 npm install  # Install dependencies
 npm start    # Start the frontend server (default port: 3000)
3.Set Up PostgreSQL Database

1.	Open pgAdmin and create a new database named chat_management.
2.	Import the provided database backup using:
o	pgAdmin: Right-click on the database > Restore > Select chat_management_backup.sql
4. Environment Variables (.env)
5. 
 .env file in the backend folder and add:
DB_USER=postgres
DB_HOST=localhost
DB_NAME=chat_management
DB_PASSWORD=yourpassword
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key

5.To run backend 

run the commnad node server.js
6.to run frontend

run the command npm start 
________________________________________
How the Chat System Works

HR Dashboard (UniBox)
•	Displays all chat conversations from multiple platforms.
•	Includes filters (Pending Replies, Follow-up Date, Status, Job Type).
•	HR can click on a user chat to open the ChatBox and respond.
ChatBox (Real-Time Messaging)
•	HR & User can send instant messages via WebSockets.
•	Messages are stored in the database (messages table).
•	Previous chat history is visible when opening a conversation.
•	File attachments can be sent & downloaded.

________________________________________
 API Endpoints
 
Authentication Routes
•	POST /register - User Registration
•	POST /login - User Login
Chat Routes
•	GET /chats - Get all chats (with filters)
•	GET /chats/:chatId - Get messages of a specific chat
•	POST /messages - Send a new message
________________________________________
Testing the Real-Time Chat
How to Test Real-Time Updates
1.	Open the app in two browser windows (One for HR, one for User).( http://localhost:3000/)
2.	For user(http://localhost:3000/chat/user1). Didn’t build no ui for user chat due to lack of time.
3.	HR & User should see messages appear instantly when sent.
4.	Messages should also be stored in the database (messages table).
5.	Refresh the page and ensure previous chat history is still visible.


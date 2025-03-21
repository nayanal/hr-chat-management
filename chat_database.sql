PGDMP         2                }            chat_management    14.6    14.6     
           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    17184    chat_management    DATABASE     k   CREATE DATABASE chat_management WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_India.1252';
    DROP DATABASE chat_management;
                postgres    false            �            1259    17252    chats    TABLE     ,  CREATE TABLE public.chats (
    id integer NOT NULL,
    account_username character varying(255) NOT NULL,
    job_post_id integer NOT NULL,
    job_type character varying(255) NOT NULL,
    follow_up_date date DEFAULT (now() + '2 days'::interval) NOT NULL,
    status character varying(50) NOT NULL,
    platform character varying(50) NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT chats_platform_check CHECK (((platform)::text = ANY ((ARRAY['Upwork'::character varying, 'Fiverr'::character varying, 'Behance'::character varying, 'Pinterest'::character varying])::text[]))),
    CONSTRAINT chats_status_check CHECK (((status)::text = ANY ((ARRAY['Archived'::character varying, 'Working on POC'::character varying, 'Starred'::character varying])::text[])))
);
    DROP TABLE public.chats;
       public         heap    postgres    false            �            1259    17251    chats_id_seq    SEQUENCE     �   CREATE SEQUENCE public.chats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.chats_id_seq;
       public          postgres    false    212                       0    0    chats_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.chats_id_seq OWNED BY public.chats.id;
          public          postgres    false    211            �            1259    17265    messages    TABLE     �   CREATE TABLE public.messages (
    id integer NOT NULL,
    chat_id integer,
    sender character varying(255) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.messages;
       public         heap    postgres    false            �            1259    17264    messages_id_seq    SEQUENCE     �   CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.messages_id_seq;
       public          postgres    false    214                       0    0    messages_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;
          public          postgres    false    213            �            1259    17243    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    17242    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    210                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    209            g           2604    17255    chats id    DEFAULT     d   ALTER TABLE ONLY public.chats ALTER COLUMN id SET DEFAULT nextval('public.chats_id_seq'::regclass);
 7   ALTER TABLE public.chats ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    211    212            l           2604    17268    messages id    DEFAULT     j   ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);
 :   ALTER TABLE public.messages ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    213    214            f           2604    17246    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    210    209    210                      0    17252    chats 
   TABLE DATA           �   COPY public.chats (id, account_username, job_post_id, job_type, follow_up_date, status, platform, notes, created_at) FROM stdin;
    public          postgres    false    212   �                 0    17265    messages 
   TABLE DATA           L   COPY public.messages (id, chat_id, sender, message, created_at) FROM stdin;
    public          postgres    false    214   q                 0    17243    users 
   TABLE DATA           7   COPY public.users (id, username, password) FROM stdin;
    public          postgres    false    210   �                   0    0    chats_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.chats_id_seq', 2, true);
          public          postgres    false    211                       0    0    messages_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.messages_id_seq', 167, true);
          public          postgres    false    213                       0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 1, true);
          public          postgres    false    209            s           2606    17263    chats chats_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.chats DROP CONSTRAINT chats_pkey;
       public            postgres    false    212            u           2606    17273    messages messages_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public            postgres    false    214            o           2606    17248    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    210            q           2606    17250    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    210            v           2606    17274    messages messages_chat_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_chat_id_fkey;
       public          postgres    false    3187    214    212               �   x�}α� ������ �����.�Ņ��%6@������'��s�(@p}�.�3x�7M>Pɥ����[����������5,e��O�_p��"J4����B�Z�k��!��`�'�"J8EF;0٧[�4j7t�kt&�	m�)e2k�f�}�aAh         z  x����N�0���)nwj��O�.HP�va�g@bq��ƭG�Ӓ����xnR� �����s�E.#��C�����u�P-K]m�6�������R9��o��ZAm]X[��e$�̆<���$�DL"��2=zt�}�p 3t����a���yK�Ѻx��z���$,�i�w�����} sBC���#��37`��;�K�]Hoa�Uж:�R��Zh�C�G�,c2�cA�,��:3}sZ�!S�����C�_WHٖ��l+0��]Uצ�)R1�q)s��#'��3�;A��/5:�d��%������_�֮���V��#���4��}�z��9��@��O鬊pp�3�ݨS<��$��%Тr�\"i=V�EV$�3����*�{         S   x�3��K�L�K�T1JR14P)rK�p�q�7�+�
Iq�p�2r�֫p2��v̳�r�ϰ4r�-,37	��K5���,����� R�      
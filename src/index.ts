import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AuthRoute from './routes/authRoute';
import MessageRoute from './routes/messageRoute';
import ChatRoomRoute from './routes/ChatRoomRoute';
import jwt from 'jsonwebtoken'; 

dotenv.config();

const DATABASE_URI = process.env.DATABASE_URI;
const JWT_SECRET = process.env.JWT_SECRET; 

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use('/api', AuthRoute);
app.use('/api', MessageRoute);
app.use('/api', ChatRoomRoute);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.headers.authorization;

  if (!token || !JWT_SECRET) {
    return next(new Error('Authentication error: Missing token or secret.'));
  }
  const tokenString = token.split(' ')[1];
  try {
    const decoded = jwt.verify(tokenString, JWT_SECRET);
    // attach the decoded user data to the socket object
    socket.data.user = decoded; 
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    next(new Error('Authentication error: Invalid token.'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log(`User connected via Socket.IO: ${socket.id}, User ID: ${user._id}`);

  // When a user joins a chat room, subscribe them to that room.
  socket.on('joinRoom', (chatRoomId) => {
    socket.join(chatRoomId);
    console.log(`User ${user.id} joined room ${chatRoomId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected from Socket.IO: ${socket.id}`);
  });
});

mongoose.connect(DATABASE_URI!)
  .then(res => {
    console.log('connected');
  })
  .catch(err => console.log('not connected', err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
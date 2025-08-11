import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AuthRoute from './routes/authRoute'

dotenv.config();

const DATABASE_URI = process.env.DATABASE_URI

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use('/api', AuthRoute)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A new user connected via Socket.IO:', socket.id);

  // When a user joins a chat room, subscribe them to that room.
  socket.on('joinRoom', (chatRoomId) => {
    socket.join(chatRoomId);
    console.log(`User ${socket.id} joined room ${chatRoomId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected from Socket.IO:', socket.id);
  });
});

mongoose.connect(DATABASE_URI!)
.then(res =>{
  console.log('connected')
})
.catch(err => console.log('not connected'))

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

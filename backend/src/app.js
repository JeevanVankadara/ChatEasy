import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import {app, server, io, usersMap} from "./lib/socket.js";

dotenv.config();

import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.route.js';

const port = process.env.PORT || 5001;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

io.on("connection", (socket) => {
  console.log('a user is connected ', socket.id);
  const userId = socket.handshake.query.userId;
  
  if(userId && userId !== "undefined") {
    usersMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(usersMap));
  }

  socket.on("disconnect", () => {
    console.log('a user got disconnected ', socket.id);
    if(userId && userId !== "undefined") {
      delete usersMap[userId];
      io.emit("getOnlineUsers", Object.keys(usersMap));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});


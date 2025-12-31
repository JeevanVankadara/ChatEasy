import express from "express";
import {Server} from "socket.io";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
    credentials: true
  }
});

export const usersMap = {};

export function getSocketId(receiverId){
  return usersMap[receiverId];
}

export {app, server, io};

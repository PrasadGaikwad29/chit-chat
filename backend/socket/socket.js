import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const allowedOrigins = (
  process.env.FRONTEND_URL || "https://chit-chat-eta-ten.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (requestOrigin, callback) => {
      if (
        !requestOrigin ||
        allowedOrigins.includes(requestOrigin) ||
        /^https:\/\/[-a-z0-9]+\.vercel\.app$/i.test(requestOrigin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };

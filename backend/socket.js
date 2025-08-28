import { Server } from "socket.io";
import express from "express";
import http from "http";

import dotenv from "dotenv";
import { serializeData } from "./socket_utils/twitchNoti_utils.js";
dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") ?? [
  "http://localhost:3000",
];
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("a user connected, id:", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("Event", (arg) => {
    var data = serializeData(arg);
    socket.emit("Event", data);
  });
});

// instrument(io, {
//   auth: {
//     type: "basic",
//     username: adminUser,
//     password: adminPass, // "changeit" encrypted with bcrypt
//   },
// });

export { io, httpServer, app };

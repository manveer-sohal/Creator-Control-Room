import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { initSocket } from "./socket.js";
// import { instrument } from "@socket.io/admin-ui";

const app = express();
const httpServer = http.createServer(app);

initSocket(httpServer); // attach sockets

// const adminPass = process.env.ADMINPASS;
// const adminUser = process.env.ADMINUSER;

const port = process.env.PORT || 3001;
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") ?? [
  "http://localhost:3000",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// app.use("/api/clothes", clothesRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/weather", weatherRoutes);

app.get("/healthz", (_req, res) =>
  res.status(200).send("ok! All systems go!!")
);

app.get("/", (_req, res) => res.send("Go to /healthz for health check"));

export function createServer() {
  return httpServer;
}

if (process.env.NODE_ENV !== "test") {
  httpServer.listen(port, () => {
    console.log(
      `HTTP + Socket.IO server listening on http://localhost:${port}`
    );
  });
}

export { app };

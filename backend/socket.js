import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

function serializeData(event_data) {
  var user_name = event_data.event.user_name;
  var broadcaster_user_name = event_data.event.broadcaster_user_name;
  var type = event_data.subscription.type;
  return {
    user_name: user_name,
    broadcaster_user_name: broadcaster_user_name,
    type: type,
  };
}

export function initSocket(httpServer) {
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

  return io;
}

const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const app = express();
const { generateMessage } = require("./utils/messages");
const publicStaticDirectory = path.join(__dirname, "../public");
const {
  addUser,
  removeUser,
  getUsersInRoom,
  getUser
} = require("./utils/users");

app.use(express.json());
app.use(express.static(publicStaticDirectory));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  socket.on("join", ({ username, room }, callback) => {
    const { user, error } = addUser({ username, room, id: socket.id });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit("welcome", "Welcome to Chatify");
    socket.broadcast
      .to(room)
      .emit("welcome", `${user.username} has joined the chat`);
    callback();
  });

  socket.on("sendMessage", (msg, callback) => {
    const obj = getUser(socket.id);
    const username = obj.username;
    io.in(obj.room).emit("sendMessage", { ...generateMessage(msg), username });
    callback("I've gotten the message");
  });

  socket.on("sendLocation", (loc, callback) => {
    io.emit("shareLocation", loc);
    callback("Location Shared");
  });
});

server.listen(3000, () => {
  console.log("Listening on Port 3000");
});

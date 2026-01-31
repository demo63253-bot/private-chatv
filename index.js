const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const PASSWORD = "1234"; // 🔐 change this

io.on("connection", (socket) => {

  socket.on("auth", ({ password }) => {
    if (password === JustforU) {
      socket.join("private");
      socket.emit("auth-success");
    } else {
      socket.emit("auth-fail");
    }
  });

  socket.on("typing", () => {
    socket.to("private").emit("typing");
  });

  socket.on("message", (data) => {
    socket.to("private").emit("message", data);
    socket.emit("delivered", data.id);
  });

  socket.on("seen", (id) => {
    socket.to("private").emit("seen", id);
  });

  socket.on("react", ({ id, emoji }) => {
    socket.to("private").emit("react", { id, emoji });
  });

});

server.listen(3000, () => {
  console.log("Private chat running");
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const routes = require("./routes");
const { storageMessage } = require("./dao/ChatMessageDAO");

const connectedUsers = {};

mongoose.connect(
  "mongodb://127.0.0.1:27017/mensseger",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err, db) => {
    if (err) {
      console.log(err);
    }

    console.log("MongoDB Connected");

    io.on("connection", (socket) => {
      const { user_id } = socket.handshake.query;
      connectedUsers[user_id] = socket.id;

      socket.on('join', (msg) => {
        socket.join(msg);
      });

      socket.on('input', (msg) => {
        if(storageMessage(msg)){
          socket.to(`${msg.data.activedChat}`).emit('output', {
            activedChat: msg.data.activedChat,
            user_id: msg.data.user_id,
            message: msg.data.message
          })
        }
      })
    });

    
    
  }
);

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);
server.listen(3333);

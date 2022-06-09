const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const Filter = require("bad-words");
const { createMessage } = require("./utils/createMessages");
const { getUserList, addUser, removeUser, findUser } = require("./utils/users");
app.use(express.static(path.join(__dirname, "../public")));

const server = http.createServer(app);
const io = socketIo(server);

// lắng nghe sự kiện kết nối từ client
io.on("connection", (socket) => {
  console.log("New client connected!");

  socket.on("join room from server to client", ({ room, username }) => {
    socket.join(room);

    // chào
    // gửi cho client kêt nối vào
    socket.emit(
      "send message from server to client",
      createMessage(`Chào Mừng Bạn Đến Với Phòng ${room}`, "Admin")
    );

    // gửi cho các client còn lại
    socket.broadcast
      .to(room)
      .emit(
        "send message from server to client",
        createMessage(`${username} Vừa Tham Gia Vào Phòng ${room}`,"Admin")
      );

    // chat
    socket.on("send message from client to server", (messageTest, callback) => {
      const filter = new Filter();
      // console.log(filter.clean("Don't be an ash0le"));
      if (filter.isProfane(messageTest)) {
        return callback("messageTest không hợp lệ!");
      }

      const id = socket.id;
      const user = findUser(id);

      io.to(room).emit(
        "send message from server to client",
        createMessage(messageTest, user.username)
      );
      callback();
    });

    // Xử lí share location
    socket.on(
      "send location from client to server",
      ({ latitude, longitude }) => {
        const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
        io.to(room).emit("send location from server to client", linkLocation);
      }
    );

    // Xử lí userList
    const newUser = {
      id: socket.id,
      username,
      room,
    };

    addUser(newUser);
    io.to(room).emit("send user list from server to client", getUserList(room));

    // Ngắt kết nối
    socket.on("disconnect", () => {
      removeUser(socket.id);
      // gửi cho các client còn lại
      socket.broadcast
        .to(room)
        .emit(
          "send message from server to client",
          createMessage(`${username} Vừa Rời Khỏi Phòng ${room}`, username)
        );
      io.to(room).emit(
        "send user list from server to client",
        getUserList(room)
      );
      console.log("Client disconnected");
    });
  });
});

// lắng nghe event kết nối
const port = 8000;
server.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});

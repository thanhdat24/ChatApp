const socket = io();

document.getElementById("form-message").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageTest = document.getElementById("input-message").value;
  const acknowledgement = (error) => {
    if (error) {
      return alert("Tin nhắn không hợp lệ!");
    }
    console.log("Tin nhắn gửi thành công!");
  };
  socket.emit(
    "send message from client to server",
    messageTest,
    acknowledgement
  );
});

socket.on("send message from server to client", (messageTest) => {
  console.log("messageTest: ", messageTest);
});

// gửi vị trí
document.getElementById("btn-location").addEventListener("click", (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert("Trình duyệt không hỗ trợ vị trí!");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("send location from client to server", { latitude, longitude });
    console.log("position: ", position);
  });
});

socket.on("send location from server to client", (linkLocation) => {
  console.log("linkLocation: ", linkLocation);
});

// Xử lí query string
const params = Qs.parse(window.location.search, { ignoreQueryPrefix: true });

const { room, username } = params;
socket.emit("join room from server to client", { room, username }, (error) => {
  if (error) {
    alert(error);
    window.location.href = "/";
  }
});

// Xử lí userList
socket.on("send user list from server to client", (userList) => {
  console.log("userList: ", userList);
});

const socket = io();

document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageTest = document.getElementById("input-messages").value;
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

socket.on("send message from server to client", (message) => {
  console.log("message: ", message);
  // hiện thị lên màn hình
  const content = $("#app__messages").html();
  const messageEle = /*html*/ `
     <div class="message-item">
                    <div class="message__row1">
                        <p class="message__name">${message.username}</p>
                        <p class="message__date">${message.createAt}</p>
                    </div>
                    <div class="message__row2">
                        <p class="message__content">
                            ${message.messagesText}
                        </p>
                    </div>
                </div>
                `;
  let contentRender = content + messageEle;
  $("#app__messages").html(contentRender);

  // clear input messages
  $("#input-messages").val("");
});

// gửi vị trí
// document.getElementById("btn-location").addEventListener("click", (e) => {
//   e.preventDefault();
//   if (!navigator.geolocation) {
//     return alert("Trình duyệt không hỗ trợ vị trí!");
//   }
//   navigator.geolocation.getCurrentPosition((position) => {
//     const { latitude, longitude } = position.coords;
//     socket.emit("send location from client to server", { latitude, longitude });
//     console.log("position: ", position);
//   });
// });

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

// hiện thị tên phòng
$("#app__title").html(room);

// Xử lí userList
socket.on("send user list from server to client", (userList) => {
  console.log("userList: ", userList);

  let content = "";
  userList.forEach((user) => {
    content += `<li class="app__item-user">${user.username}</li>`;
  });
  $("#app__list-user--content").html(content);
});

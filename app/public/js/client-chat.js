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
  const { username, messagesText, createAt } = message;
  // hiện thị lên màn hình
  const content = $("#app__messages").html();
  const messageEle = /*html*/ `
     <div class="message-item">
                    <div class="message__row1">
                        <p class="message__name">${username}</p>
                        <p class="message__date">${createAt}</p>
                    </div>
                    <div class="message__row2">
                        <p class="message__content">
                            ${messagesText}
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
document.getElementById("btn-share-location").addEventListener("click", (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert("Trình duyệt không hỗ trợ vị trí!");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("send location from client to server", { latitude, longitude });
  });
});

socket.on("send location from server to client", (data) => {
  const { username, messagesText, createAt } = data;
  console.log("data", data);

  const content = $("#app__messages").html();
  const messageEle = /*html*/ `
     <div class="message-item">
                    <div class="message__row1">
                        <p class="message__name">${username}</p>
                        <p class="message__date">${createAt}</p>
                    </div>
                    <div class="message__row2">
                        <p class="message__content">
                        <a href="${messagesText}" target="_blank">Vị Trí Của ${username}</a>
                            
                        </p>
                    </div>
                </div>
                `;
  let contentRender = content + messageEle;
  $("#app__messages").html(contentRender);
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

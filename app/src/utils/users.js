let userList = [
  {
    id: 1,
    userName: "Lê Thành Đạt",
    room: "LT01",
  },
  {
    id: 2,
    userName: "Trần Thị Ngọc Diệp",
    room: "LT02",
  },
];

const addUser = (newUser) => (userList = [...userList, newUser]);
const removeUser = (id) =>
  (userList = userList.filter((user) => user.id !== id));
const getUserList = (room) => userList.filter((user) => user.room === room);

module.exports = {
  getUserList,
  addUser,
  removeUser,
};

let userList = [
  {
    id: 1,
    username: "Lê Thành Đạt",
    room: "LT01",
  },
  {
    id: 2,
    username: "Trần Thị Ngọc Diệp",
    room: "LT02",
  },
];

const addUser = (newUser) => (userList = [...userList, newUser]);
const removeUser = (id) =>
  (userList = userList.filter((user) => user.id !== id));
const getUserList = (room) => userList.filter((user) => user.room === room);
const findUser = (id) => userList.find((user) => user.id === id);
module.exports = {
  getUserList,
  addUser,
  removeUser,
  findUser,
};

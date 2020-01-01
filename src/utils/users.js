var users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const newUser = { id, username, room };
  const existUser = users.find(
    user => user.username === username && user.room === room
  );
  if (existUser) {
    return { error: "Username is in use" };
  }
  users.push(newUser);
  return { user: newUser };
};

const removeUser = id => {
  const length = users.length;
  users = users.filter(u => u.id !== id);
  if (users.length === length) {
    return { error: "Username does not exist" };
  }
  return users;
};

const getUser = id => {
  const myUser = users.find(u => u.id === id);

  if (!myUser) {
    return { error: "User does not exist" };
  }
  return myUser;
};

const getUsersInRoom = ({ id, room }) => {
  const myUsers = users.filter(u => u.id === id && u.room === room);
  return myUsers;
};

module.exports = { getUser, getUsersInRoom, addUser, removeUser };

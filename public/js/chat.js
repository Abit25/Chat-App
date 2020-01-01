const socket = io();
const $sendLocation = document.querySelector("#btn2");
const $messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("welcome", msg => {
  console.log(msg);
});

const autoscroll = () => {
  // New message element

  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.clientHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;
  console.log(scrollOffset, containerHeight - newMessageHeight);
  if (containerHeight - newMessageHeight <= scrollOffset + 1) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.emit("join", { username, room }, error => {
  if (error) {
    console.log(error);
  } else {
    console.log("Succesfully joined room");
  }
});

document.querySelector("#btn").addEventListener("click", () => {
  const input = document.getElementById("msg").value;
  document.getElementById("msg").value = "";
  socket.emit("sendMessage", input, val => {
    console.log("Message Delivered ", val);
  });
});

$sendLocation.addEventListener("click", () => {
  $sendLocation.style.visibility = "hidden";
  navigator.geolocation.getCurrentPosition(pos => {
    const coords = pos.coords;
    socket.emit(
      "sendLocation",
      "https://google.com/maps?q=" + coords.latitude + "," + coords.longitude,
      msg => console.log(msg)
    );
    $sendLocation.style.visibility = "visible";
  });
});

socket.on("sendMessage", ({ message, createdAt, username }) => {
  console.log("Reached");
  createdAt = moment(createdAt).format("h:mm a");
  const html = Mustache.render(messageTemplate, {
    message,
    createdAt,
    username
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("shareLocation", url => {
  const html = Mustache.render(locationTemplate, { url });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

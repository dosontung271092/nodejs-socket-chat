const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');

// Get username and room from URL

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
}); 

const socket = io();

// Join chatroom
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
  
  console.log( chatMessages.scrollHeight );

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


// Output message to DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName( roomName ){
  document.getElementById('room-name').innerHTML = roomName;
}

// Add user name to DOM
function outputUsers( users ){
  document.getElementById('users').innerHTML = `
    ${users.map(user => `<li> ${user.username}</li>`).join('')}
  `;

}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Bạn có muốn rời phòng chat?');
  if (leaveRoom) {
    window.location = '../index.html';
  }
});
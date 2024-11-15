const lblPending = document.querySelector('#lbl-pending');

async function loadInitialCount() {
  const pending = await fetch('/api/ticket/pending').then((res) => res.json());
  lblPending.innerText = pending.length || 0;
}

function connectToWebSockets() {
  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = (event) => {
    console.log(event.data);
    const { payload, type } = JSON.parse(event.data);

    if (type !== 'on-ticket-count-changed') return;

    lblPending.innerText = payload;
  };

  socket.onclose = (event) => {
    console.log('Connection closed');
    setTimeout(() => {
      console.log('retrying to connect');
      connectToWebSockets();
    }, 1500);
  };

  socket.onopen = (event) => {
    console.log('Connected');
  };
}

loadInitialCount();
connectToWebSockets();

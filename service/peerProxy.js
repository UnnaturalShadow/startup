const { WebSocketServer, WebSocket } = require('ws');

function peerProxy(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  // Track rooms: roomId -> Set of sockets
  const rooms = new Map();

  function joinRoom(socket, roomId) {
    // Leave old room if exists
    if (socket.roomId && rooms.has(socket.roomId)) {
      rooms.get(socket.roomId).delete(socket);
    }

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    rooms.get(roomId).add(socket);
    socket.roomId = roomId;
  }

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;

    socket.on('message', function message(data) {
      let msg;

      try {
        msg = JSON.parse(data);
      } catch {
        return; // ignore invalid JSON
      }

      // Handle join separately
      if (msg.type === 'join') {
        joinRoom(socket, msg.roomId);
        return;
      }

      // Broadcast ONLY to same room
      const room = rooms.get(socket.roomId);
      if (!room) return;

      room.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
    });

    socket.on('close', () => {
      if (socket.roomId && rooms.has(socket.roomId)) {
        rooms.get(socket.roomId).delete(socket);
      }
    });

    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  // Keep alive (unchanged from template)
  setInterval(() => {
    socketServer.clients.forEach((client) => {
      if (client.isAlive === false) return client.terminate();

      client.isAlive = false;
      client.ping();
    });
  }, 10000);
}

module.exports = { peerProxy };
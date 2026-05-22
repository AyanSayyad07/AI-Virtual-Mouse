function setupSockets(io) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Receive data stream from Python AI engine
    socket.on('ai_data_stream', (data) => {
      // data should contain { frame: base64_string, gestures: array_of_active_gestures }
      // Broadcast this data to all connected clients (React Frontend)
      socket.broadcast.emit('frontend_update', data);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = setupSockets;

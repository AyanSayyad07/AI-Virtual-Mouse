function setupSockets(io) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Receive data stream from Python AI engine
    socket.on('ai_data_stream', (data) => {
      socket.broadcast.emit('frontend_update', data);
    });

    // Receive custom gesture settings from Frontend and send to Python AI
    socket.on('update_gesture_rules', (rules) => {
      console.log('New gesture rules received:', rules);
      socket.broadcast.emit('new_gesture_rules', rules);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = setupSockets;

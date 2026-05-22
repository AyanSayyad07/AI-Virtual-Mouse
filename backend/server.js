const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const setupSockets = require('./sockets/socketHandler');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Initialize Socket.io with CORS allowing our frontend
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for dev, restrict in prod
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e8 // 100 MB max payload for video frames
});

// Setup socket event handlers
setupSockets(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

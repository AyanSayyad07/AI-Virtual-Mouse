import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

// Create a singleton instance
export const socket = io(SOCKET_URL, {
  autoConnect: false, // We'll connect manually when the dashboard mounts
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

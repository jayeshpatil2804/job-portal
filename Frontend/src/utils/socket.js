import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: false // Connect only when user is logged in
});

export const connectSocket = (userId) => {
    if (!socket.connected) {
        socket.connect();
        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('joinRoom', userId);
        });
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export default socket;

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

// Apply CORS middleware
app.use(cors({
    origin: '*', // Allow all origins. Replace with frontend URL for stricter security.
    methods: ['GET', 'POST'] // Specify allowed methods
}));


// Configure CORS for Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Replace '*' with the specific URL of your frontend
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('User Online');

    socket.on('canvas-data', (data) => {
        socket.broadcast.emit('canvas-data', data);
    });
});

const serverPort = process.env.YOUR_PORT || process.env.PORT || 5000;
httpServer.listen(serverPort, () => {
    console.log(`Started on: ${serverPort}`);
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);


// Configure CORS for Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // Replace '*' with the specific URL of your frontend
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    console.log('User Connected: ', socket.id);

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    socket.on('disconnect', ()=>{
        console.log('User disconnected:', socket.id);
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});




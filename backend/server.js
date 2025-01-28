const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const admin = require('firebase-admin');  //import firebase admin SDK
 
const app = express();
const server = http.createServer(app);

const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Configure CORS for Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // Replace '*' with the specific URL of your frontend
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    console.log('User Connected: ', socket.id);

    socket.on('join-board', (boardId) =>{
        socket.join(boardId);
        console.log(`User ${socket.id} joined board ${boardId}`);
    })
    socket.on('draw', (data) => {
        const {boardId, drawingData} = data;    // Destructure the object
        socket.to(boardId).emit('draw', drawingData);
    });

    socket.on('disconnect', ()=>{
        console.log('User disconnected:', socket.id);
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});




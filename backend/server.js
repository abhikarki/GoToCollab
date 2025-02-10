const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
 
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// API routes
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
  });
  

// Map to keep track of users for specific board. 
const boardUsers = new Map();    // boardId -> Set of Socket IDs.

// Configure CORS for Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'https://stellar-pony-2e4d1f.netlify.app', // Replace '*' with the specific URL of your frontend
        methods: ['GET', 'POST']
    }
});

// Create a new board.
app.post('/api/boards', (req, res) => {
    const boardId = Date.now().toString(36)+ Math.random().toString(36).substr(2);
    boardUsers.set(boardId, new Set());
    res.json({boardId});
});


io.on('connection', (socket) => {
    console.log('User Connected: ', socket.id);

    // Add the user to a specific room identified by boardId.
    socket.on('join-board', (boardId) =>{
        socket.join(boardId);
        console.log("here");
        //if the map doesnot already have the boardId, create one with empty set of users.
        if(!boardUsers.has(boardId)){
            boardUsers.set(boardId, new Set());
        }

        // Get the set.
        const usersInBoard = boardUsers.get(boardId);
        
        if(usersInBoard.size > 0){
            const existingUser = [...usersInBoard][0];   // convert to array and access the first element.
            io.to(existingUser).emit('request-board-state', {
                boardId,
                requestingUser: socket.id
            });
        }
        usersInBoard.add(socket.id); // Map is updated as usersInBoard is a reference, not just a copy.

        console.log(`User ${socket.id} joined board ${boardId}`);
    })

    // When the user shares their current state of the board, share it with the receiving user.
    socket.on('board-state-share', ({receivingUser, imageData}) =>{
        io.to(receivingUser).emit('receive-board-state', imageData);
    })


    // Sharing the drawing data.
    socket.on('draw', ({boardId, ...drawData}) => {
        // Emit the drawData to all the users with the boardId except the sender.
        socket.to(boardId).emit('draw', drawData);   
    });

    // When a user disconnects.
    socket.on('disconnect', ()=>{
        for(const [boardId, users] of boardUsers.entries()){
            users.delete(socket.id);
            if(users.size == 0){
                boardUsers.delete(boardId);
            }
        }
        console.log('User disconnected:', socket.id);
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});




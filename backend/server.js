const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const admin = require('firebase-admin');  //import firebase admin SDK
 
const app = express();
const server = http.createServer(app);

admin.initializeApp({
    credential: admin.credential.applicationDefault(),  //service account key file
    databaseURL: "YOUR_FIREBASE_DATABASE_URL"   //Firebase Realtime Database URL
});

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

app.post('/api/boards', async(req, res) =>{
    try{
        const boardRef = await db.collection('boards').add({
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            canvasData: ""
        });
        res.json({boardId: boardRef.id});
    }catch(error){
        console.error('Error creating board: ', error);
        res.status(500).json({error: 'Failed to create board'});
    }
});


app.get('/api/boards/:boardId', async(req, res) =>{
    try{
        const boardDoc = await db.collection('boards').doc(req.params.boardId).get();
        if(!boardDoc.exists){
            res.status(404).json({error: 'Board not found'});
            return;
        }
        res.json({id: boardDoc.id, ...boardDoc.data()});
    }catch(error){
        console.error('Error getting board: ', error);
        res.status(500).json({error: 'Failed to get board'});
    }
})

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




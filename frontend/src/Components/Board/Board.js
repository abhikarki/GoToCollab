import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {io} from 'socket.io-client';
import './Board.css';

const Board = () => {
  const { boardId } = useParams();
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const lastPositionRef = useRef({x:0, y:0});

  useEffect(() => {
    //Connect to WebSocket Server
    socketRef.current = io('https://gotocollab.onrender.com/', {
      transports: ['websocket'],
      reconnection: true
    });

    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to fill window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Set up initial canvas properties
    ctx.strokeStyle = '#000000';   // color of the stroke
    ctx.lineWidth = 2;             // thickness of the stroke
    ctx.lineCap = 'round';         // how the end of a line looks.
    ctx.lineJoin = 'round';        // specify how two lines meet at a corner.
    
    setContext(ctx);

    // Try to add the board to the server or if the boardId exists, we get the current state of the board.
    socketRef.current.emit('join-board', boardId);

    // Emit the current board state to the requesting user
    socketRef.current.on('request-board-state', ({ requestingUser }) =>{
      const imageData = canvas.toDataURL('image/png');
      socketRef.current.emit('board-state-share', {
        receivingUser: requestingUser,
        imageData
      });
    });

    // Receive the current board state if you are a new user.
    socketRef.current.on('receive-board-state', (imageData) =>{
      const img = new Image();
      img.onload = () =>{
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageData;
    });

    // Receive the draw data from other users using the same board.
    socketRef.current.on('draw', (data) => {
      drawRemoteStroke(data, ctx);
    });

    // Handle window resize
    const handleResize = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.putImageData(imageData, 0, 0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Remove the resize event listener to prevent memory leaks.
      window.removeEventListener('resize', handleResize);
      // Close the web socket connection if it exists.
      socketRef.current.disconnect();
    }
  }, []);

  const drawRemoteStroke = (data, ctx) => {
    if (!ctx) return;
    const canvas = canvasRef.current;
    ctx.beginPath();
    ctx.moveTo(data.from.x * canvas.width, data.from.y * canvas.height);
    ctx.lineTo(data.to.x * canvas.width, data.to.y * canvas.height);
    ctx.stroke();
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    lastPositionRef.current = pos;
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    
    const pos = getMousePos(e);
    
    context.beginPath();
    context.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
    context.lineTo(pos.x, pos.y);
    context.stroke();

    // Send to server
    socketRef.current.emit('draw', {
      boardId,
      from: normalize(lastPositionRef.current, canvasRef.current),
      to: normalize(pos, canvasRef.current),
    })
    
    lastPositionRef.current = pos;
  };

  const normalize = (pos, canvas) => ({
    x: pos.x / canvas.width,
    y: pos.y / canvas.height,
  });

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      //rect.left = distance from the canvas's left edge to the viewport's left edge.
      //rect.top = distance from the canvas's top edge to the viewport's top edge 
      x: e.clientX - rect.left, //e.clientX  and e.clientY are the coordinates relative to the entire viewport
      y: e.clientY - rect.top
    };
  };

    return(
      <div className="Board">
      <canvas
        ref={canvasRef}
        className="touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          startDrawing(touch);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          draw(touch);
        }}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};

export default Board;




import React, { useState, useEffect, useRef } from 'react';

import './Board.css';

const Board = (props) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const lastPositionRef = useRef({x:0, y:0});

  useEffect(() => {
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

    // Handle window resize
    const handleResize = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.putImageData(imageData, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    
    lastPositionRef.current = pos;
  };

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

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import './Board.css';

const Board = (props) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [timeout, setTimeoutState] = useState(null);
    const socket = useRef(io.connect("http://localhost:5000"));
    const ctx = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const socketInstance = socket.current;

        socketInstance.on("canvas-data", (data) => {
            const interval = setInterval(() => {
                if (isDrawing) return;
                setIsDrawing(true);
                clearInterval(interval);
                const image = new Image();
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                image.onload = () => {
                    context.drawImage(image, 0, 0);
                    setIsDrawing(false);
                };
                image.src = data;
            }, 200);
        });

        return () => {
            socketInstance.off("canvas-data");
        };
    }, [isDrawing]);

    useEffect(() => {
        drawOnCanvas();
    }, []);

    useEffect(() => {
        if (ctx.current) {
            ctx.current.strokeStyle = props.color;
            ctx.current.lineWidth = props.size;
        }
    }, [props.color, props.size]);

    const drawOnCanvas = () => {
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext('2d');
        const context = ctx.current;

        const sketch = document.querySelector('#sketch');
        const sketchStyle = getComputedStyle(sketch);
        canvas.width = parseInt(sketchStyle.getPropertyValue('width'));
        canvas.height = parseInt(sketchStyle.getPropertyValue('height'));

        let mouse = { x: 0, y: 0 };
        let lastMouse = { x: 0, y: 0 };

        // Mouse capturing
        canvas.addEventListener('mousemove', (e) => {
            lastMouse.x = mouse.x;
            lastMouse.y = mouse.y;

            mouse.x = e.pageX - canvas.offsetLeft;
            mouse.y = e.pageY - canvas.offsetTop;
        });

        context.lineWidth = props.size;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.strokeStyle = props.color;

        const onPaint = () => {
            context.beginPath();
            context.moveTo(lastMouse.x, lastMouse.y);
            context.lineTo(mouse.x, mouse.y);
            context.closePath();
            context.stroke();

            if (timeout) clearTimeout(timeout);

            const timeoutID = setTimeout(() => {
                const base64ImageData = canvas.toDataURL("image/png");
                socket.current.emit("canvas-data", base64ImageData);
            }, 1000);

            setTimeoutState(timeoutID);
        };

        // Mouse down and up events
        canvas.addEventListener('mousedown', () => {
            canvas.addEventListener('mousemove', onPaint);
        });

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', onPaint);
        });
    };

    return (
        <div className="sketch" id="sketch">
            <canvas className="board" ref={canvasRef}></canvas>
        </div>
    );
};

export default Board;

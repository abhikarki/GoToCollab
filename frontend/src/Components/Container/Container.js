import React, { useEffect, useState } from "react";
import Board from "../Board/Board";
import Tools from "../Tools/Tools";

import "./Container.css";
import { useParams } from "react-router-dom";

const Container = () => {
  const { boardId } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const [color, setColor] = useState("#000000"); // Default black color
  const [boardLink, setBoardLink] = useState('');

  useEffect(() => {
    setBoardLink(`${window.location.origin}/board/${boardId}`);
  }, [boardId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(boardLink)
    .then(() =>{
      setShowAlert(true);   
      setTimeout(() => setShowAlert(false), 3000);  // Disappear after 3 seconds.
    })
    .catch((err) => console.error('Failed to Copy: ', err));
  };

  return (
    <div className="Container-class">
      <div className="copy-link-container">
        <input
          type="text"
          value={boardLink}
          readOnly
          className="board-link-input"
          style={{width: `${boardLink.length}ch`}}
        />
        <button onClick={copyToClipboard} id="copy-link-button">
          Copy Link
        </button>
        {showAlert && (
          <div className="copied-alert-message"> Board link copied to clipboard</div>
        )}
      </div>
      
      {/* <Tools color={color} setColor={setColor} /> */}
      <div className="board-wrapper">
        <Board />
      </div>
      
    </div>
  );
}

export default Container;

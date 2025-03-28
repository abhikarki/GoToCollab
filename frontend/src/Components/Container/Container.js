import React, {useEffect, useState} from "react";
import Board from "../Board/Board";
import Tools from "../Tools/Tools";

import "./Container.css";

const Container = () =>{
    const { boardId } = useParams();
    const [color, setColor] = useState("#000000") // Default black color
    const [boardLink, setBoardLink] = useState('');

    useEffect(() => {
        setBoardLink(`${window.location.origin}/board/${boardId}`);
    }, [boardId]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(boardLink)
          .then(() => alert('Board link copied to clipboard!'))
          .catch((err) => console.error('Failed to copy: ', err));
    };

    return(
        <div className="Container-class">
            <div className="copy-link-container">
                <input 
                    type="text" 
                    value={boardLink} 
                    readOnly 
                    className="board-link-input" 
                />
                <button onClick={copyToClipboard} id="copy-link-button"></button>
            </div>
            <Tools color = {color} setColor = {setColor}/>
            <Board />
        </div>
    )
}

export default Container;
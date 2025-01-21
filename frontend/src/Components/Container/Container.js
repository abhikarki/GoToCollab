import React, {useState} from "react";
import Board from "../Board/Board";
import Tools from "../Tools/Tools";

import "./Container.css";

const Container = () =>{
    const [color, setColor] = useState("#000000") // Default black color

    return(
        <div className="Container-class">
            <Tools color = {color} setColor = {setColor}/>
            <Board color = {color}/>
        </div>
    )
}

export default Container;
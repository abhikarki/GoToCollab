import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import "./LandingPage.css"

const LandingPage = () =>{
    const navigate = useNavigate();
    const [isBoardLoading, setIsBoardLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const createNewBoard = async () =>{
       setIsBoardLoading(true);
       setLoadingMessage("Creating a brand new board for you...");
        try{
            const response = await axios.post('https://gotocollab.onrender.com/api/boards');
            const {boardId} = response.data;
            setIsBoardLoading(false);
            navigate(`/board/${boardId}`);
        }
        catch(error){
            console.error('Error creating board: ', error);
        }
    }

    return(
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">GoToCollab</h1>
      
          {isBoardLoading && (
                    <div className="text-lg font-semibold text-gray-700 mb-4">
                        {loadingMessage}
                    </div>
                )}
          <button
            onClick={createNewBoard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg 
                     shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Create New Board
          </button>
        </div>
      </div>
    )
}

export default LandingPage;
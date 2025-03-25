import React from "react";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


const LandingPage = () =>{
    const navigate = useNavigate();

    const createNewBoard = async () =>{
        try{
            const response = await axios.post('https://gotocollab.onrender.com/api/boards');
            const {boardId} = response.data;
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
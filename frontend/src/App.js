import React from 'react';
import Board from './Components/Board/Board';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage/LandingPage';
import Container from './Components/Container/Container';


function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<LandingPage />} />
        <Route path = "/board/:boardId" element = {<Container />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

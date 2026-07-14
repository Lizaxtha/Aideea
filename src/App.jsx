// import { useState } from 'react'

import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home";
import IdeaCards from "./components/IdeaCards";
import ListView from "./components/ListView";

function App() {

  return (
  
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/hobby/:hobbyName" element={<IdeaCards />} />
      <Route path="/list/:hobbyName" element={<ListView />} />
    </Routes>
    </BrowserRouter>

        

       
    
  );
}

export default App;


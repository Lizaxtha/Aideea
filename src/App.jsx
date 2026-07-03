// import { useState } from 'react'

import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

function App() {

  return (
  
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/Login" element={<Login/>}/>
    </Routes>
    </BrowserRouter>

        

       
    
  );
}

export default App;

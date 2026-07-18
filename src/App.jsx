import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home";
import IdeaCards from "./components/IdeaCards";
import ListView from "./components/ListView";
import Profile from "./components/Profile";

function App() {

  return (
  
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/hobby/:hobbyName" element={<IdeaCards />} />
      <Route path="/list/:hobbyName" element={<ListView />} />
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
    </BrowserRouter>

        

       
    
  );
}

export default App;


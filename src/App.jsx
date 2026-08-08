import {BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home";
import IdeaCards from "./components/IdeaCards";
import ListView from "./components/ListView";
import Profile from "./components/Profile";
import Constellation from "./components/Constellation";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
  
    <BrowserRouter>
    <Routes>

      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login/>}/>

      <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>}/>
      <Route path="/hobby/:hobbyName" element={<ProtectedRoute> <IdeaCards /> </ProtectedRoute>} />
      <Route path="/list/:hobbyName" element={<ProtectedRoute> <ListView /> </ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute> <Profile /></ProtectedRoute>}/>
      <Route path="/constellation" element={<ProtectedRoute><Constellation /></ProtectedRoute>}/>
      
    </Routes>
    </BrowserRouter>  
    
  );
}

export default App;


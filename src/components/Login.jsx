import "./SignUp.css";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";
import {useState} from "react";

import { useNavigate } from "react-router-dom";

function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const Submit = async (e)=>{
        e.preventDefault();
        try{
        await signInWithEmailAndPassword(
            auth,email,password
        );
        alert("Logged In!");
            navigate("/home");
    }
    catch(error){
        alert(error.message);
    }
    }

    return(
        <>
        <video
            autoPlay
            loop
            muted
            playsInline
            className="bg-vid"
            >
                <source src="/Video3.mp4"/>
            </video>

        <div className="container">
            <h1 className="h1 heading">Welcome Back</h1>
            
                <form className="form" onSubmit={Submit}>

                <h2>Login</h2>

                <div>
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                </div>

                <div>
                <label>Password</label>
                <input type="password" placeholder="Enter your password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} />
                </div>
                <button className="btn">Done</button>
                <a href="">Forgot your Password?</a>
                </form>
            
        </div>
        </>
    )
}

export default Login;
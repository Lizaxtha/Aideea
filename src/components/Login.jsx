import "./SignUp.css";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";
import {useState} from "react";

function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

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
            <h1 className="heading">Welcome Back</h1>
            
                <form className="form">

                <h2>Login</h2>

                <div>
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" />
                </div>

                <div>
                <label>Password</label>
                <input type="password" placeholder="Enter your password" />
                </div>
                <button className="btn">Done</button>
                <a href="">Forgot your Password?</a>
                </form>
            
        </div>
        </>
    )
}

const handleLogin=async(e) => {
    e.preventDefault();

    try{
await signInWithEmailAndPassword(
    auth,email,password
);
        alert("Logged In!");
    }
    catch (error){
        alert(error.message);
    }
}

export default Login;
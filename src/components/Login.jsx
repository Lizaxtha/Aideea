import "./SignUp.css";
import {signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import {auth} from "../firebase";
import {useState} from "react";

import { useNavigate, Link } from "react-router-dom";

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

    //for forgot password

    const[Popup, setPopup]=useState(false);
    const [resetEmail,setResetEmail] = useState("");

    const resetPassword=async ()=>{

        if(!resetEmail.trim()){
            alert("Please enter your email.");
            return;
        }

        try{
            await sendPasswordResetEmail(auth, resetEmail);
            alert("Password reset link sent! Please check your inbox.");

            setPopup(false);
            setResetEmail("");
        }
        catch(error){
            alert(error.message);
        }
    };

    return(
        <>
        <video
            autoPlay
            loop
            muted
            playsInline
            className="bg-vid"
            >
                <source src="/video3.mp4"/>
            </video>

        <div className="container">
            <h1 className="h1-animation heading h1-large">Welcome Back</h1>
            
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

                <button className="btn">LogIn</button>

                <Link to="/">
                    Don't have an account? Sign up
                </Link>
                <br/>
                <p className="forgot-password" onClick={()=>setPopup(true)}>Forgot your Password?</p>
            
                </form>
        </div>

        {Popup &&(

            <div className="popup-overlay">

                <div className="popup">

                    <h2> Reset Password </h2>
                    <p>Enter your email address</p>

                    <input 
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e)=>setResetEmail(e.target.value)}
                    />

                    <div className="popup-button">
                        <button onClick={()=>{
                            setPopup(false);
                            setResetEmail("");
                        }}>
                            Cancel
                        </button>
                        <button onClick={resetPassword}>Send Link</button>
                    </div>

                </div>
            </div>
        )}

        </>
    )
}

export default Login;
import "./SignUp.css";
import {signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import {auth} from "../firebase";
import {useState} from "react";

import { useNavigate, Link } from "react-router-dom";

function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const submit = async (e)=>{
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

    const[popup, setPopup]=useState(false);
    const [resetEmail,setResetEmail] = useState("");

    const resetPassword=async ()=>{

        if(!resetEmail.trim()){
            alert("Please enter your email.");
            return;
        }

        try{
            await sendPasswordResetEmail(auth, resetEmail);
            alert("Password reset link sent!");

            setPopup(false);
            setResetEmail("");
        }
        catch(error){

            switch(error.code){

                case "auth/user-not-found":
                alert("No account exists with this email.");
                break;

                case "auth/invalid-email":
                alert("Please enter a valid email");
                break;

                case "auth/too-many-requests":
                    alert("Too many attempts. Please try again later.");
                    break;

                    default: alert("Unable to send reset link.");

            }
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
            
                <form className="form" onSubmit={submit}>

                <h2>Login</h2>

                <div>
                    <label>Email</label>
                    <input type="email" className="s-input" placeholder="Enter your email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                </div>

                <div>
                <label>Password</label>
                <input type="password" className="s-input" placeholder="Enter your password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} />
                </div>

                <button type="submit" className="btn">LogIn</button>

                <Link to="/">
                    Don't have an account? Sign up
                </Link>
                <br/>
                <p className="forgot-password" onClick={()=>setPopup(true)}>Forgot your Password?</p>
            
                </form>
        </div>

        {popup &&(

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
                        <button type="cancel" onClick={()=>{
                            setPopup(false);
                            setResetEmail("");
                        }}>
                            Cancel
                        </button>
                        <button type="reset" onClick={resetPassword}>Send Link</button>
                    </div>

                </div>
            </div>
        )}

        </>
    )
}

export default Login;
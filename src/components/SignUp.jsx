import "./SignUp.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {useState} from "react";


function SignUp() {

    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit =async(e) =>{
        e.preventDefault();
        
        try {

            if(!email.trim()||!password.trim()){
                alert("Please fill all fields");
                return;
            }

            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            
            alert("Account created!");
            navigate("/home");
            
        }
        
        catch(error){
            alert(error.message);
        }
     };   

    return (
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
            <div className="heading">
                 <h1 className="h1-large">Aideea</h1>
                <h1 className="h1-animation h1-small">Ready to keep IDEAS safe!!</h1>
            </div>

            <form className="form" onSubmit={submit}>
                <h2>Sign up</h2>
<br/>
                <div>
                    <label>Name</label>
                    <input type="text" className="s-input"
                    value={name}
                     onChange={(e)=>setName(e.target.value)}
                     placeholder="Enter your name" />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" className="s-input"
                    value={email}
                     onChange={(e)=>setEmail(e.target.value)} 
                    placeholder="Enter your email" />
                </div>

                <div>
                    <label>Password</label>
                   <input type="password" className="s-input"
                   value={password} 
                onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Create password" />
                </div>

                <button className="btn"type="submit">SignUp</button>

                <br />

                <Link to="/login" className="a">
               
                Already have an account? Login
            
                </Link>

            </form>
        </div>
        </>

    );
}



export default SignUp;
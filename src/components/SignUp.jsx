import { Link } from "react-router-dom";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {useState} from "react";

// import{
//     doc,
//     setDoc
// } from "firebase/firestore";

// import {db} from "../firebase";




function SignUp() {

    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /* const openHome =(e)=>{
        e.preventDefault();
         */ 

    const Submit =async(e) =>{
        e.preventDefault();
        
        try {
    //         const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            
            alert("Account created!");
            navigate("/home");
    //         console.log(userCredential.user);
        }
        
        catch(error){
            alert(error.message);
        }
     };   

    //     await setDoc(
    // doc(
    //     db, "users", userCredential.user.uid),
    // {name,email}
    //     );
    
     

        // await createUserWithEmailAndPassword(
        //     auth,email,password
        // );

    return (
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
            <div className="heading">
               
                 <h1>Aideea</h1>
                <h1 className="h1">Ready to keep IDEAS safe!!</h1>
                
            </div>

            <form className="form" onSubmit={Submit}>
                <h2>Sign up</h2>
<br/>
                <div>
                    <label>Name</label>
                    <input type="text" 
                    value={name}
                     onChange={(e)=>setName(e.target.value)}
                     placeholder="Enter your name" />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" 
                    value={email}
                     onChange={(e)=>setEmail(e.target.value)} 
                    placeholder="Enter your email" />
                </div>

                <div>
                    <label>Password</label>
                   <input type="password" 
                   value={password} 
                onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Create password" />
                </div>

                <button className="btn"type="submit">Done</button>

                <br />

                <Link to="/Login" className="a">
               
                Already have an account? Login
            
                </Link>

            </form>
        </div>
        </>

    );
}



export default SignUp;
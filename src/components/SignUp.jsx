import {Link} from "react-router-dom";
import "./SignUp.css";

function SignUp() {
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
                <h1>Ready to keep IDEAS safe!!</h1>
                
            </div>

            <form className="form">
                <h2>Sign up</h2>
<br/>
                <div>
                    <label>Name</label>
                    <input type="text" placeholder="Enter your name" />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email" />
                </div>

                <div>
                    <label>Password</label>
                   <input type="password" placeholder="Create password" />
                </div>

                <button className="btn"type="submit">Done</button>

                <br />

                <Link to="/Login">
               <a>
                Already have an account? Login
                </a> 
                </Link>

            </form>
        </div>
        </>

    );
}

export default SignUp;
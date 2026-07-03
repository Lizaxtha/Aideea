import "./SignUp.css";

function Login(){
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

export default Login;
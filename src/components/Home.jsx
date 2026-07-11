import { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    // default hobby + user can add hobby

    const [hobbies, setHobbies] = useState(["Ideas"]);
    const [newHobby, setNewHobby] = useState("");
    const addHobby = () => {
        if (!newHobby.trim()) return;
        setHobbies([...hobbies, newHobby]);
        setNewHobby("");
    };

    //allows to select idea

    const [selectedHobby, setselectedHobby] = useState("");

    //for cards/hobbies with idea

    const [Idea, setIdea] = useState("");
    const [saved, setSaved] = useState({});
    const SaveIdea = () => {
        if (!Idea.trim()) return;
        const hobbyName = selectedHobby || "Ideas";
        setSaved({
            ...saved,
            [hobbyName]: [
                ...(saved[hobbyName] || []),
                Idea
            ]
        });
        setIdea("");
    }

    return (
        <>

            <video
                autoPlay
                loop
                muted
                playsInline
                className="H-bg-vid"
            >
                <source src="/video8.mp4" />
            </video>

            <div className="H-Title">
                <h1>Aideea</h1>
                <p>Dump your creative ideas</p>
            </div>

            <div className="H-container">

                <div className="H-enter">
                    <input className="H-input" type="text" placeholder="Write down your idea!" value={Idea} onChange={(e) => setIdea(e.target.value)} />
                    <button className="btn1" onClick={SaveIdea}>Save</button>
                </div>

                <div className="H-hobby">
                    <input className="H-input" type="text" placeholder="Add a hobby"
                        value={newHobby} onChange={(e) => setNewHobby(e.target.value)}
                    />

                    {/* to create hobby */}

                    <button className="btn2" onClick={addHobby}><img src="/add1.png" /></button>

                    {/* {hobbies.map((hobby,index)=>(
                        <p key={index}>{hobby}</p>))}  
                    */}


                    {/* can choose hobbies */}

                    <select value={selectedHobby} onChange={(e) => setselectedHobby(e.target.value)}>
                        <option value="">Choose Hobby</option>
                        {hobbies.map((hobby, index) =>
                        (
                            <option key={index} value={hobby}> {hobby} </option>
                        )
                        )}
                    </select>
                </div>
            </div>

            {/* generates cards/hobbies with ideas */}

            <div className="H-cards">
                {Object.entries(saved).map(([hobbyName, ideas]) =>(

                        <Link to={`/hobby/$hobbyName}`}
                            target="_blank">
                                
                            <div className="card" key={hobbyName}>
                                <h3 className="card-heading">
                                    {hobbyName}
                                </h3>
                                <ul>
                                    {ideas.map((item, index) =>
                                    (
                                        <li key={index}>{item}</li>
                                    )
                                    )}
                                </ul>
                            </div>
                        </Link>
                    )
                )}
            </div>

        </>
    )
}

export default Home;


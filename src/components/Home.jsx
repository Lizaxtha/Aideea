import { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import {collection, addDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase";
import {auth} from "../firebase";
import {onAuthStateChanged} from "firebase/auth";

function Home() {

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

    const SaveIdea = async() => {
        if (!Idea.trim()) return;
        const hobbyName = selectedHobby || "Ideas";

        try{
            await addDoc(collection(db, "ideas"),
                {
                    userId:auth.currentUser.uid,
                    hobby: hobbyName,
                    text: Idea
                }
            );
            // alert("Idea Saved!");
            setIdea("");
        }
        catch(error){
            alert(error.message);
        }
        setSaved({
            ...saved,
            [hobbyName]: [
                ...(saved[hobbyName] || []),
                Idea
            ]
        });
       
    }

    const LoadIdeas =async()=>{
        // const loadedHobbies =["Ideas"];
        const q=query(
            collection(db, "ideas"),
            where("userId", "==", auth.currentUser.uid)
        )

        const result = await getDocs(q);
        const loadedIdeas ={};

        const loadedHobbies=["Ideas"];
        result.forEach((doc)=>{
            const data=doc.data();
            if(!loadedIdeas[data.hobby]){
                loadedIdeas[data.hobby]=[];
            }
            
            loadedIdeas[data.hobby].push(data.text);
            if(!loadedHobbies.includes(data.hobby)){
                loadedHobbies.push(data.hobby);
            }
        });

        setSaved(loadedIdeas);
        setHobbies(loadedHobbies);
    }
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(
            auth,
            (user)=>{
                if(user){
                    LoadIdeas();
                }
            }
        );
       return()=> unsubscribe();
    },[]);

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
            
<Link to="/profile"> <button>Profile</button> </Link>
<Link to={"/Constellation"} target="_blank"> <p>Constellation View</p> </Link>
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

                        <Link 
                        key={hobbyName}
                        to={`/hobby/${hobbyName}`}
                        target="_blank">
                                
                            <div className="card">
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


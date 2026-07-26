import { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import {collection, addDoc, getDocs, query, where, serverTimestamp,setDoc,doc,deleteDoc} from "firebase/firestore";
import {db} from "../firebase";
import {auth} from "../firebase";
import {onAuthStateChanged} from "firebase/auth";

function Home() {

    // default hobby + user can add hobby

    const [hobbies, setHobbies] = useState(["Ideas"]);
    const [newHobby, setNewHobby] = useState("");

    const[pinnedHobbies, setPinnedHobbies] = useState({});

    const addHobby = async() => {
        if (!newHobby.trim()) return;
        try{
            await setDoc(
                doc(db,"hobbies", newHobby),
                {
                    userId:auth.currentUser.uid,
                    name:newHobby,
                    pinned:false
                }
            );
            await loadHobbies();
            setNewHobby("");
        }
        catch(error){
            alert(error.message);
        }
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
            await addDoc(
                collection(db, "ideas"),
                {
                    userId:auth.currentUser.uid,
                    hobby: hobbyName,
                    text: Idea,
                    createdAt:serverTimestamp()
                }
            ); 
            // alert("Idea Saved!");
            setIdea("");
        }
        catch(error){
            alert(error.message);
        }
        setSaved(prev=>({
            ...prev,
            [hobbyName]: [
                ...(prev[hobbyName] || []),
                Idea
            ]
        }));
       
    }

    const LoadIdeas =async()=>{
        
        const q=query(
            collection(db,"ideas"),
            where("userId","==",auth.currentUser.uid)
        );
        const result=await getDocs(q);

        const loadedIdeas ={};

        result.forEach((document)=>{
            const data=document.data();
            if(!loadedIdeas[data.hobby]){
                loadedIdeas[data.hobby]=[];
            }
            
            loadedIdeas[data.hobby].push(data.text);
            
        });

        setSaved(loadedIdeas);
    }
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(
            auth,
            (user)=>{
                if(user){
                    LoadIdeas();
                    loadHobbies();
                }
            }
        );
       return()=> unsubscribe();
    },[]);

    const loadHobbies =async()=>{
        const q=query(
            collection(db,"hobbies"),
            where("userId","==",auth.currentUser.uid)
        );
        const result =await getDocs(q);
        console.log(result.docs.map(doc=>doc.data().name));

        const hobbySet = new Set(["Ideas"]);
        const pinnedMap={};
        
        result.forEach((document)=>{

            console.log(document.data().name);
            hobbySet(document.data().name);

            const data =document.data();

            hobbySet.add(data.name);
            pinnedMap[data.name] = data.pinned || false;
        });
console.log("Final Hobbies:", [...hobbySet]);

        setHobbies([...hobbySet]);
        setPinnedHobbies(pinnedMap);
    };

    const togglePin =async(hobbyName)=>{

        try{
            const newPinned =!pinnedHobbies[hobbyName];

            await setDoc(
                doc(db,"hobbies",hobbyName),
                {
                    userId:auth.currentUser.uid,
                    name:hobbyName,
                    pinned:newPinned
                },
                {merge:true}
            );
        
        setPinnedHobbies(prev=>({
            ...prev,
            [hobbyName]: newPinned
        }));

        }
        catch(error){
            alert(error.message);
        }
    }

    const sortedSaved = Object.entries(saved).sort(([a],[b])=>{
        const pinA=pinnedHobbies[a] ? 1: 0;
        const pinB=pinnedHobbies[b] ? 1: 0;
        return pinB-pinA;
    });

    const deleteHobby =async() =>{
        if(!selectedHobby || selectedHobby === "Ideas") return;
        const confirmDelete=window.confirm(
            `Delete the hobby "${selectedHobby}"?`
        )

        if(!confirmDelete) return;
        try{
            await deleteDoc(
                doc(db,"hobbies", selectedHobby)
            )

            setSaved(prev=>{
                const updated={...prev};
                delete updated[selectedHobby];
                return updated;
            });
            await loadHobbies();
            setselectedHobby("");
            alert("Hobby deleted.");
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
                className="H-bg-vid"
            >
                <source src="/video8.mp4" />
            </video>
            
<Link to="/profile"> <button className="H-btn-profile">Profile</button> </Link>
<Link to={"/Constellation"} target="_blank"> <p className="H-constellation">Constellation View</p> </Link>
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

                    <button className="delete-hobby-btn"
                    onClick={deleteHobby}
                    disabled={!selectedHobby || selectedHobby === "Ideas"}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* generates cards/hobbies with ideas */}

            <div className="H-cards">
                {sortedSaved.map(([hobbyName,ideas]) =>(

                        <Link 
                        key={hobbyName}
                        to={`/hobby/${hobbyName}`}
                        target="_blank">
                                
                            <div className="card">

                                <button className="pin-btn"
                                onClick={(e)=>{
                                    e.preventDefault();
                                    togglePin(hobbyName);
                                }}>
                                    <img src={pinnedHobbies[hobbyName] ? "/pinned.webp":""}
                                    alt="pin"
                                    />
                                </button>

                                <h3 className="card-heading">
                                    {hobbyName}
                                </h3>

                                <ul>
                                    {ideas.slice(0,5).map((item, index) =>
                                    (
                                        <li key={index}>

                                            {item.length>30
                                            ?item.slice(0,30) + "..."
                                            : item }

                                        </li>
                                    ))
                                    }
                                    {ideas.length > 5 && (
                                                 <p className="more-ideas">
                                                     +{ideas.length - 5} more ideas...
                                                 </p>
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


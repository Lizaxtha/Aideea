import{useParams, Link} from "react-router-dom";
import{useState, useEffect} from "react";
import "./IdeaCards.css";
import React from "react";
import {collection,query,where,getDocs} from "firebase/firestore";
import {db,auth} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function IdeaCards(){

    const { hobbyName}=useParams();
    
    const[IdeaCards, setIdeas] =useState([]);
    const[selectedIdea, setSelectedIdea]=useState(null);

    const loadIdeas=async(uid)=>{
        const q=query(
            collection(db,"ideas"),
            where("userId","==",uid),
            where("hobby","==",hobbyName)
        );
        const result =await getDocs(q);
        const temp =[];
        result.forEach((doc)=>{
            temp.push({
                id:doc.id,
                ...doc.data()
            });
        });
        setIdeas(temp);
        
    };
    useEffect(()=>{
const unsubscribe=onAuthStateChanged(
    auth,
    (user)=>{
        if(user){
            loadIdeas(user.uid);
        }
    }
)
return unsubscribe;
    },[]);
    

    return(
        <>
        <video
        autoPlay
        loop
        muted
        playsInline
        className="I-bgvid">
            <source src="/video10.mp4"/>
        </video>
<h1 className="i-h1">{hobbyName}</h1>

        <div className="i-container1">
            <Link to={`/list/${hobbyName}`}>
        <p>List View </p>
        </Link>
            <p>Constellation View</p>
        </div>

        <div className="bubble-container">
            {IdeaCards.map((idea)=>(

                <div className="idea-bubble"
                key={idea.id}
                onClick={()=>setSelectedIdea(idea)}
                style={{
                    top:`${Math.random()*70}%`,
                    left:`${Math.random()*80}%`
                }  
                }
                >
                {idea.text}
                </div>
            ))}
        </div>
{selectedIdea&&(
<div className="sidebar">
    <button className="close-btn" onClick={()=>setSelectedIdea(null)}>
        close
    </button>
    <h2>Idea Details</h2>
    <p>{selectedIdea.text}</p>

    <div className="sidebar-actions">
        <button className="i-edit-btn">
            Edit
        </button>
        <button className="i-delete-btn">
            Delete
        </button>
    </div>
    </div>
)}

        </>
 )
 }

export default IdeaCards;
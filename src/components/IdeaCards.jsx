import{useParams} from "react-router-dom";
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
        
<h1 className="i-h1">{hobbyName}</h1>

        <div className="i-container1">
            <p>List view</p>
            <p>Constellation View</p>
        </div>

        <div className="i-container2">
            {IdeaCards.map((idea)=>(
                <div className="idea-bubble"
                key={idea.id}
                onClick={()=>setSelectedIdea(idea)}>
                {idea.text}
                </div>
            ))}
        </div>

        </>
 )
 }

export default IdeaCards;
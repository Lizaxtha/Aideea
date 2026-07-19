import "./Constellation.css";
import { useState,useEffect } from "react";
import {collection, query, where, getDocs} from "firebase/firestore";
import {db, auth} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function Constellation(){

    const [ideas,setIdeas]=useState([]);

    const loadIdeas =async(uid)=>{
        const q=query(
            collection(db,"ideas"),
            where("userId", "==",uid)
        );
        const result=await getDocs(q);
        const temp=[];
        result.forEach((doc)=>{
            temp.push({
                id:doc.id,
                ...doc.data()
            });
        });
        setIdeas(temp);
    }

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,(user)=>{
            if(user){
                loadIdeas(user.uid);
            }
        });
        return unsubscribe;
    },[]);

    const groupedIdeas={};
    

    return(
        <div className="c-page">

        <div className="c-heading">
        <h1>Constellation</h1>
        <p>The more the lights the creative your are.</p>
        </div>

        <div className="star-container">
            {ideas.map((idea)=>

            <div key={idea.id} className="star" 
            style={{
                // top:`${x}px`,
                // left:`${y}px`
            }}>
                {/* <img src=""/> */}
                o
                </div>

            )}
         </div>

        </div>
    )
}

export default Constellation;
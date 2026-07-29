import{useParams, Link} from "react-router-dom";
import{useState, useEffect} from "react";
import "./IdeaCards.css";
import React from "react";
import {collection,query,where,getDocs, deleteDoc,doc,updateDoc} from "firebase/firestore";
import {db,auth} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function IdeaCards(){

    const { hobbyName}=useParams();
    
    const[IdeaCards, setIdeas] =useState([]);
    const[selectedIdea, setSelectedIdea]=useState(null);
    const[editedText,setEditedText] = useState("");

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
    
    //for delete action
    const deleteIdea = async ()=>{
        if(!selectedIdea) return;

        const confirmDelete=window.confirm(
            "Delete this idea?"
        );

        if(!confirmDelete) return;

        try{
            await deleteDoc(
                doc(db,"ideas",selectedIdea.id)
            )

            setIdeas(prev=>
                prev.filter(idea=>idea.id!==selectedIdea.id)
            );
            setSelectedIdea(null);
        }
        catch(error){
            alert(error.message);
        }
    };

    //for save action

    const saveIdea =async() =>{
        if(!selectedIdea) return;
        try{
            await updateDoc(
                doc(db,"ideas", selectedIdea.id),
                {
                    text:editedText
                }
            );
            setIdeas(prev=>
                prev.map(idea=>idea.is===selectedIdea.id ? {...idea, text: editedText} : idea

                )
            );
            setSelectedIdea({
                ...selectedIdea,
                text:editedText
            });
            alert("Idea updated");
        }
        catch(error){
            alert(error.message);
        }
    };

    const [bubbleData,setBubbleData] = useState([]);



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
        </div>

        <div className="bubble-container">
            {IdeaCards.map((idea)=>(

                <div className="idea-bubble"
                key={idea.id}
                onClick={()=>{
                    setSelectedIdea(idea);
                     setEditedText(idea.text);
                }}
                style={{
                    // top:,
                    // left:,
                    animationDuration: `${4+Math.random()*4}s`,
                    animationDelay: `${Math.random()*3}s`,
                    width: idea.size,
                    height: idea.size
                }}
                >
                {idea.text}
                </div>
            ))}
        </div>
{selectedIdea&&(
<div className="sidebar">
    <button className="close-btn"
     onClick={()=> setSelectedIdea(null)}>
        close
    </button>
    <h2>Idea Details</h2>
   
        <textarea value={editedText} 
        onChange={(e)=>setEditedText(e.target.value)}/>
        <p>{selectedIdea.text}</p>

    <p>{selectedIdea.createdAt ? selectedIdea.createdAt.toDate().toLocaleString() : "No timestamp"}</p>

    <div className="sidebar-actions">
        <button className="i-save-btn" onClick={saveIdea}>
            Save
        </button>
        <button className="i-delete-btn" onClick={deleteIdea}>
            Delete
        </button>
    </div>
    </div>
)}

        </>
 )
 }

export default IdeaCards;
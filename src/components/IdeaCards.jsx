import{useParams, Link} from "react-router-dom";
import{useState, useEffect} from "react";
import "./IdeaCards.css";
import {collection,query,where,getDocs, deleteDoc,doc,updateDoc} from "firebase/firestore";
import {db,auth} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Bubbles from "./Bubbles";

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
                prev.map(idea=>idea.id===selectedIdea.id ? {...idea, text: editedText} : idea

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

    return(

        <>

        <video
        autoPlay
        loop
        muted
        playsInline
        className="I-bgvid">
            <source src="/IdeaCards-vid.mp4"/>
        </video>

        <div className="i-container1">
            <h1 className="i-h1">{hobbyName}</h1>
            <Link to={`/list/${hobbyName}`} >
                <p className="i-list">List View </p>
            </Link>
        </div>

        <div>
            <Bubbles ideas={IdeaCards}
            onBubbleClick={(idea)=>{
                setSelectedIdea(idea);
                setEditedText(idea.text);
            }}/>
        </div>

{selectedIdea&&(
<div className="sidebar">
    <button className="close-btn"
     onClick={()=> setSelectedIdea(null)}>
        close
    </button>
    <h2>Details</h2>
   
        <textarea className="i-textarea" value={editedText} 
        onChange={(e)=>setEditedText(e.target.value)}/>

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


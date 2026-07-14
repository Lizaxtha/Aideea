import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import {collection,query,where,getDocs,deleteDoc,doc,updateDoc} from "firebase/firestore";
import {db,auth} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./ListView.css";

function ListView(){

    const{hobbyName}=useParams();
    
    const[ideas,setIdeas]=useState([]);
    const loadIdeas =async(uid)=>{
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
        const unsubscribe=onAuthStateChanged(auth,(user)=>{
            if(user){
                loadIdeas(user.uid);
            }
        });
        return unsubscribe;
    },[]);

//for delete action
const deleting = async(id)=>{
    try{
        await deleteDoc(
            doc(db,"ideas",id)
        );
        alert("Idea Deleted!");
        setIdeas(
            ideas.filter(
                (idea)=>idea.id !== id
            )
        );
    }
    catch(error){
        alert(error.message);
    }
}

//for edit action
const [editedText,setEditedText]=useState("");
const editing=async(id)=>{
    try{
        await updateDoc(
         doc(db,"ideas",id),
         {
             text:editedText
         }
        );
   
    await loadIdeas(auth.currentUser.uid);
    alert("Idea Updated");
    }
    catch(error){
        alert(error.message);
    }
}


    return(
        <>
        <h1 className="L-heading">{hobbyName}</h1>
        <ul>
            {ideas.map((idea)=>(
                <li key={idea.id}>
                    {idea.text}
                    <button onClick={()=> deleting(idea.id)}>Delete</button>
                    <button onClick={()=> editing(idea)}>Edit</button>
                </li>
            ))}
        </ul>
        </>
    )
}

export default ListView;
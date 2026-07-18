import {auth, db} from "../firebase";
import {useEffect, useState} from "react";
import{collection,query,where,getDocs} from "firebase/firestore";
import "./Profile.css";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Profile(){

const navigate=useNavigate();
const logout=async()=>{
    try{
        await signOut(auth);
        navigate("/login");
    }
    catch(error){
        alert(error.message);
    }
}

    const user =auth.currentUser;
    //show idea count
    const [ideaCount, setIdeaCount] = useState(0);
    const loadIdeas = async()=>{
        const q = query(
            collection(db, "ideas"),
            where ("userId", "==", auth.currentUser.uid)
        );
        const result = await getDocs(q);
        setIdeaCount(result.size);
    };
useEffect(()=>{
    if(auth.currentUser){
        loadIdeas();
        loadHobbies();
    }
},[]);

// show hobby count
const[hobbyCount,setHobbyCount]=useState(0);
const loadHobbies = async()=>{
    const q=query(
        collection(db,"ideas"),
        where ("userId","==",auth.currentUser.uid)
    );
    const result =await getDocs(q);
    const hobbies=new Set();
    result.forEach((document)=>{
        hobbies.add(document.data().hobby);
    });
    setHobbyCount(hobbies.size);
};

    return(
        <>
        <div className="p-container">
            <div className="profile">
            <h1>User Profile</h1>
    
            <p>User Id:{user?.uid}</p>
            <p>Email: {user?.email}</p>
            <p>Total Ideas:{ideaCount}</p>
            <p>Total Hobbies:{hobbyCount}</p>

            <button onClick={logout}>Logout</button>

            <p>Joined:{" "}{new Date(user?.metadata?.creationTime).toLocaleDateString()}</p>

            </div>
        </div>
        </>
    )
}

export default Profile;
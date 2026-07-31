import { useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import{auth} from "../firebase"
import { onAuthStateChanged } from "firebase/auth";

function ProtectedRoute({children}){

    const[user,setUser]=useState(undefined);

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth, (currentUser)=>
        {
            setUser(currentUser);
        });
        return unsubscribe;
    },[]);

    if(user===undefined){
        return <p>Loading...</p>;
    }
    if(!user){
        return<Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;
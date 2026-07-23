import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./Profile.css";
import { signOut, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Profile() {

    const navigate = useNavigate();
    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        }
        catch (error) {
            alert(error.message);
        }
    }

    const user = auth.currentUser;
    //show idea count
    const [ideaCount, setIdeaCount] = useState(0);
    const loadIdeas = async () => {
        const q = query(
            collection(db, "ideas"),
            where("userId", "==", auth.currentUser.uid)
        );
        const result = await getDocs(q);
        setIdeaCount(result.size);
    };
    useEffect(() => {
        if (auth.currentUser) {
            loadIdeas();
            loadHobbies();
        }
    }, []);

    // show hobby count
    const [hobbyCount, setHobbyCount] = useState(0);
    const loadHobbies = async () => {
        const q = query(
            collection(db, "ideas"),
            where("userId", "==", auth.currentUser.uid)
        );
        const result = await getDocs(q);
        const hobbies = new Set();
        result.forEach((document) => {
            hobbies.add(document.data().hobby);
        });
        setHobbyCount(hobbies.size);
    };

    //for permanent deletion of account
    const deleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account permanently? This action cannot be undone!"
        );
        if (!confirmDelete) reauthenticateWithCredential;
        try {
            //to find user's all ideas
            const q = query(
                collection(db, "ideas"),
                where("userId", "==", auth.currentUser.uid)
            );
            const result = await getDocs(q);

            //to delete all idea
            for (const document of result.docs) {
                await deleteDoc(
                    doc(db, "ideas" ,document.id)
                );
            }

            //to delete from firebase too
            await deleteUser(auth.currentUser);
            alert("account deleted");
            navigate("/");
        }
        catch (error) {
            alert(error.message);
        }
    };

    return (
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
                <button className="delete-btn" onClick={deleteAccount}>Delete Account <br/>PERMANENTLY !!</button>
            </div>
        </>
    )
}

export default Profile;
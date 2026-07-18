import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./ListView.css";

function ListView() {

    const { hobbyName } = useParams();

    const [ideas, setIdeas] = useState([]);
    const loadIdeas = async (uid) => {
        const q = query(
            collection(db, "ideas"),
            where("userId", "==", uid),
            where("hobby", "==", hobbyName)
        );
        const result = await getDocs(q);
        const temp = [];

        result.forEach((doc) => {
            temp.push({
                id: doc.id,
                ...doc.data()
            });
        });
        setIdeas(temp);
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                loadIdeas(user.uid);
            }
        });
        return unsubscribe;
    }, []);

    //for delete action
    const deleting = async (id) => {
        try {
            await deleteDoc(
                doc(db, "ideas", id)
            );
            alert("Idea Deleted!");
            setIdeas(
                ideas.filter(
                    (idea) => idea.id !== id
                )
            );
        }
        catch (error) {
            alert(error.message);
        }
    }

    //for edit action
    const [editingId, setEditingId] = useState(null);
    const [editedText, setEditedText] = useState("");
    const editing = async (id) => {
        try {
            await updateDoc(
                doc(db, "ideas", id),
                {
                    text: editedText
                }
            );
            setEditingId(null);
            await loadIdeas(auth.currentUser.uid);
            alert("Idea Updated");
        }
        catch (error) {
            alert(error.message);
        }
    }


    return (
        <>
        <div className="L-page">

            <h1 className="L-heading">{hobbyName}</h1>
            <ul className="L-list">
                {ideas.map((idea) => (
                    <li className="L-card" key={idea.id}>
                        {editingId === idea.id ? (
                            <>
                                <input value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                                <button className="save-btn" onClick={() => editing(idea.id)}>Save</button>
                            </>

                        ) : (
                            <>
                                {idea.text}
                                <button className="edit-btn" onClick={() => { setEditingId(idea.id); setEditedText(idea.text); }}>Edit</button>
                                <button className="delete-btn" onClick={() => deleting(idea.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default ListView;
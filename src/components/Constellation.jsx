import "./Constellation.css";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function Constellation() {

    const [ideas, setIdeas] = useState([]);

    const loadIdeas = async (uid) => {
        const q = query(
            collection(db, "ideas"),
            where("userId", "==", uid)
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
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                loadIdeas(user.uid);
            }
        });
        return unsubscribe;
    }, []);

    const groupedIdeas = {};

    ideas.forEach((idea) => {
        if (!groupedIdeas[idea.hobby]) {
            groupedIdeas[idea.hobby] = [];
        }
        groupedIdeas[idea.hobby].push(idea);
    });

    //setting position
    const hobbyNames = Object.keys(groupedIdeas);
    const hobbyCenters = {};
    hobbyNames.forEach((hobby, index) => {
        hobbyCenters[hobby] = {
            x: 250 + index * 350,
            y: 300
        };
    });



    return (
        <div className="c-page">

            <div className="c-heading">
                <h1>Constellation</h1>
                <p>The more the lights the creative your are.</p>
            </div>

            <div className="star-container">

                {Object.entries(groupedIdeas).map(
                    ([hobby, hobbyIdeas]) => (
                        <div key={hobby}>
                            <h2 className="c-name"
                                style={{
                                    left: `${hobbyCenters[hobby].x}px`,
                                    top: "180px"
                                }}
                            >
                                {hobby}
                            </h2>
                            {
                                hobbyIdeas.map((idea, index) => {

                                    const angle = (index / hobbyIdeas.length) * Math.PI * 2;
                                    const radius = 100;
                                    const x = hobbyCenters[hobby].x + Math.cos(angle) * radius;
                                    const y = hobbyCenters[hobby].y + Math.sin(angle) * radius;

                                    return (
                                        <div key={idea.id} className="star"
                                            style={{
                                                left: `${x}px`,
                                                top: `${y}px`
                                            }}
                                        >
                                            o
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                )}

            </div>
        </div>
    )
}

export default Constellation;
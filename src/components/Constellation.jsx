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
                offsetX:Math.random()*80-40,
                offsetY:Math.random()*80-40,
                radius:90+Math.random()*80,

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

    const starPositions = [];
    const [hoveredHobby,setHoveredHobby]=useState(null);

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
                            {hoveredHobby === hobby&&(
                            <h2 className="c-name"
                                style={{
                                    left: `${hobbyCenters[hobby].x}px`,
                                    top: "280px"
                                }}
                            >
                                {hobby}
                            </h2>
                            )}

                            {
                                hobbyIdeas.map((idea, index) => {

                                    const angle = (index / hobbyIdeas.length) * Math.PI * 2;
                                    const radius = idea.radius;
                                    const x = hobbyCenters[hobby].x + Math.cos(angle) * radius+idea.offsetX;
                                    const y = hobbyCenters[hobby].y + Math.sin(angle) * radius+idea.offsetY;

                                    starPositions.push({
                                        hobby,
                                        x,
                                        y,
                                        id: idea.id
                                    });

                                    return (

                                        <div key={idea.id} className="star"
                                        onMouseEnter={()=>setHoveredHobby(hobby)}
                                        onMouseLeave={()=>setHoveredHobby(null)}
                                            style={{
                                                left: `${x}px`,
                                                top: `${y}px`
                                            }}
                                        >
                                            ⋆
                                        </div>

                                    )
                                })
                            }


                            {/* connecting stars */}

                            <svg className="constellation-lines">
                                {
                                    Object.keys(groupedIdeas).map((hobby) => {
                                        const hobbyStars = starPositions.filter(
                                            star => star.hobby === hobby
                                        );

                                        return hobbyStars.map((star, index) => {
                                            if (index === hobbyStars.length - 1)
                                                return null;
                                            return (
                                                <line
                                                    key={`${star.id}-${index}`}
                                                    x1={star.x}
                                                    y1={star.y}
                                                    x2={hobbyStars[index + 1].x}
                                                    y2={hobbyStars[index + 1].y}
                                                />
                                            );
                                        });
                                    })
                                }
                            </svg>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default Constellation;
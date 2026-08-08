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

    //to group ideas by hobby
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

    const columns = 3;
    const spacingX = 350;
    const spacingY = 350;

    hobbyNames.forEach((hobby, index) => {
        const column = index % columns;
        const row = Math.floor(index/columns);

        hobbyCenters[hobby] = {
            x: 175 + column * spacingX,
            y: 175 + row *spacingY
        };
    });

    const rows = Math.ceil(hobbyNames.length / columns);

    const constellationWidth = columns*spacingX;
    const constellationHeight = Math.max( rows * spacingY, 500);

    const [hoveredHobby,setHoveredHobby]=useState(null);
    const[selectedHobby,setSelectedHobby] = useState(null);
    
    const starPositions = [];

     hobbyNames.forEach((hobby) => {
        const hobbyIdeas = groupedIdeas[hobby];
        const center = hobbyCenters[hobby];

        hobbyIdeas.forEach((idea, index) => {
            const angle =
                (index / hobbyIdeas.length) * Math.PI * 2;

            const radius = idea.radius;

            const x =
                center.x +
                Math.cos(angle) * radius +
                idea.offsetX;

            const y =
                center.y +
                Math.sin(angle) * radius +
                idea.offsetY;

            starPositions.push({
                hobby,
                x,
                y,
                id: idea.id
            });
        });
    });

    return (
        <div className="c-page">

            <div className="c-heading">
                <h1>Constellation</h1>
                <p>The more the lights, The more creative you are.</p>
            </div>

<div className="star-scroll">
            <div className="star-container" 
                 style={{
                    width: `${constellationWidth}px`,
                    height: `${constellationHeight}px`}}>
                                {/* connecting stars */}
    
                                <svg className="constellation-lines" width="100%" height={constellationHeight} >
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
    
                                                        className={
                                                            selectedHobby?.hobby === hobby
                                                            ? "selected-line"
                                                            : selectedHobby
                                                            ? "dim-line"
                                                            :"" 
                                                        }
                                                    />
                                                );
                                            });
                                        })
                                    }
                                </svg>

                {Object.entries(groupedIdeas).map(
                    ([hobby, hobbyIdeas]) => (

                        <div key={hobby} className="constellation-group">

                            <div className="click-area"
                            style={{
                                left:`${hobbyCenters[hobby].x-170}px`,
                                top: `${hobbyCenters[hobby].y-170}px`
                            }}
                            onClick={()=>setSelectedHobby({
                                hobby,
                                ideas:hobbyIdeas
                            })}
                            >
                            </div>

                            {hoveredHobby === hobby&&(
                            <h2 className="c-name"
                                style={{
                                    left: `${hobbyCenters[hobby].x}px`,
                                    top: `${hobbyCenters[hobby].y-20}px`
                                }}
                            >
                                {hobby}
                            </h2>
                            )}


                                {/* {hobbyIdeas.map((idea, index) => {

                                    const angle = (index / hobbyIdeas.length) * Math.PI * 2;
                                    const radius = idea.radius;
                                    const x = hobbyCenters[hobby].x + Math.cos(angle) * radius+idea.offsetX;
                                    const y = hobbyCenters[hobby].y + Math.sin(angle) * radius+idea.offsetY;

                                    starPositions.push({
                                        hobby,
                                        x,
                                        y,
                                        id: idea.id
                                    }); */}

                                    {hobbyIdeas.map((idea) => {

                                    const star =
                                        starPositions.find(
                                            (item) =>
                                                item.id === idea.id
                                        );

                                    if (!star) return null;

                                    return (

                                        <div key={idea.id} className={`star ${
                                        selectedHobby?.hobby === hobby
                                        ? "selected-star"
                                        :selectedHobby
                                        ?"dim-star"
                                        :"" }`}

                                        onMouseEnter={()=>setHoveredHobby(hobby)}
                                        onMouseLeave={()=>setHoveredHobby(null)}
                                            style={{
                                                left: `${star.x}px`,
                                                top: `${star.y}px`
                                            }}
                                        >
                                            ⋆
                                        </div>

                                    )
                                })
                            }


                        </div>
                    )
                )}
            </div>
        </div>
            {selectedHobby && (
                <div className="c-sidebar">
                    <button className="close-btn"
                    onClick={()=>setSelectedHobby(null)}
                    >
                        x
                    </button>
                    <h2>
                        {selectedHobby.hobby}
                    </h2>
                    <p>
                        {selectedHobby.ideas.length} Ideas
                    </p>
                    <ul>
                        {selectedHobby.ideas.map((idea)=>(
                            <li key={idea.id}>{idea.text}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Constellation;
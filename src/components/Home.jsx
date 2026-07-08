import { useState } from "react";
import "./Home.css";

function Home() {

// default hobby + user can add hobby

const[hobbies, setHobbies] =useState(["Ideas"]);
const [newHobby, setNewHobby] =useState("");

const addHobby =()=>{
    if(!newHobby.trim()) return;
    setHobbies([...hobbies,newHobby]);
    setNewHobby("");
};

//allows to select idea
const [selectedHobby, setselectedHobby] = useState("");

//for cards/hobbies with idea
const [Idea, setIdea] =useState("");
const [saved, setSaved]= useState({});

const SaveIdea =() => {
    if(!Idea.trim()) return;
    const hobbyName =selectedHobby || "Ideas";
    setSaved({
        ...saved,
        [hobbyName]:[
            ...(saved[hobbyName] || []),
            Idea
        ]
    });
    setIdea("");
}

    return(
<>

<div className="H-Title">
<h1>Aideea</h1>
<p>Dump your creative ideas</p>
</div>

<div className="H-container">
<div className="H-enter">
<input className="H-input" type="text" placeholder="Write down your idea!" value={Idea} onChange={(e)=> setIdea(e.target.value)} />
<button onClick={SaveIdea}>Save</button>
</div>

<div className="H-hobby">
<input className="H-input" type="text" placeholder="Add a hobby" 
 value={newHobby} onChange={(e)=>setNewHobby(e.target.value)}
 />

{/* to create hobby */}
<button onClick={addHobby}><img src=""/></button>

{/* {hobbies.map((hobby,index)=>(
    <p key={index}>{hobby}</p>)
)}  */}


{/* can choose hobbies */}
<select value={selectedHobby} onChange={(e)=> setselectedHobby(e.target.value)}>
    <option value="">Choose Hobby</option>
    {hobbies.map((hobby, index)=>
    (
        <option key={index} value={hobby}> {hobby} </option>
    )
    )}
</select>
</div>

</div>

{/* generates cards/hobbies with ideas */}
<div className="H-cards">
    {Object.entries(saved).map(
       ([hobbyName, ideas]) => 
        (
            <div className="card" key={hobbyName}>
                <h3>
                {hobbyName}
                </h3>
                <ul>
                    {ideas.map((item, index)=>
                    (
                        <li key={index}>{item}</li>
                    )
                    )}
                </ul>
                </div>
        ) 
    )}
</div>
  
</>
)
}

export default Home;


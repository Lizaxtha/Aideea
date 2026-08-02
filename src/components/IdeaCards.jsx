import{useParams, Link} from "react-router-dom";
import{useState, useEffect, useRef} from "react";
import "./IdeaCards.css";
import React from "react";
import {collection,query,where,getDocs, deleteDoc,doc,updateDoc} from "firebase/firestore";
import {db,auth} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Matter from "matter-js";

function IdeaCards(){

    const { hobbyName}=useParams();

    const bubbleRef=useRef(null);
    const[bubbleBodies, setBubbleBodies] =useState([]);
    
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
                prev.map(idea=>idea.is===selectedIdea.id ? {...idea, text: editedText} : idea

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

    useEffect(()=>{
        if(!bubbleRef.current) return;
        if(IdeaCards.length === 0) return;

        const {
            Engine,Render, Runner, Bodies, Composite 
        } = Matter;

            const engine=Engine.create();
            engine.gravity.y=0;
            
            const render = Render.create({
                element:bubbleRef.current,
                engine,
                options: {
                    width: bubbleRef.current.clientWidth,
                    height: bubbleRef.current.clientHeight,
                    wireframes:false,
                    background:"transparent"
                }
            });

            Render.run(render);

            const runner= Runner.create();
            Runner.run(runner,engine);

            const width = bubbleRef.current.clientWidth;
            const height = bubbleRef.current.clientHeight;

            const walls=[
                Bodies.rectangle(width/2,-20, width,40,{isStatic:true}),
                Bodies.rectangle(width/2, height+20,width, 40,{isStatic:true}),
                Bodies.rectangle(-20,height/2,10,height,{isStatic:true}),
                Bodies.rectangle(width +20,height/2,40,height,{isStatic:true}),
            ];
            Composite.add (engine.world, walls);

            return()=>{
                Render.stop(Render);
                Runner.stop(runner);

                render.canvas.remove();
            };

            const bubbles = IdeaCards.map((idea)=>{
                const size=80+Math.random()*70;

                const body=Bodies.circle(
                    Math.random()*width,
                    Math.random()*height,
                    size/2,
                    {
                        restitution:1,
                        friction: 0,
                        frictionAir: 0.005,
                        density: 0.001
                    }
                );
                body.idea = idea;
                body.size = size;

                return body;
            });
            Composite.add(engine.world, bubbles);

            //making bubbles drift

            Matter.Events.on(engine,"beforeUpdate",()=>{
                bubbles.forEach((bubble)=>{
                    Matter.Body.applyForce(
                        bubble,
                        bubble.position,
                        {
                            x:(Math.random()-0.5)*0.0003,
                            y:(Math.random()-0.5)*0.0003
                        }
                    )
                })
            })
    },[IdeaCards])

    setBubbleBodies(bubbles);

    let animationFrame;

    const update=()=>{
        setBubbleBodies([...bubbles]);
        animationFrame=requestAnimationFrame(update);
    };
    update()


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
            <Link to={`/list/${hobbyName}`} className="i-list">
                <p>List View </p>
            </Link>
        </div>

        <div className="bubble-container" ref={bubbleRef}>
            {bubbleBodies.map((bubble)=>(
                <div key={bubble.idea.id}
                    className="idea-bubble"
                    onClick={()=>{
                        setSelectedIdea(bubble.idea);
                        setEditedText(bubble.idea.text);
                     }}
                     style={{
                        width: bubble.size,
                        height:bubble.size,
                        left:bubble.position.x-bubble.size/2,
                        top:bubble.position.y-bubble.size/2
                     }}
                     >
                        {bubble.idea.text}
                     </div>
            ))}
        </div>

{selectedIdea&&(
<div className="sidebar">
    <button className="close-btn"
     onClick={()=> setSelectedIdea(null)}>
        close
    </button>
    <h2>Idea Details</h2>
   
        <textarea value={editedText} 
        onChange={(e)=>setEditedText(e.target.value)}/>
        <p>{selectedIdea.text}</p>

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


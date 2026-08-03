import{useParams, Link} from "react-router-dom";
import{useState, useEffect, useRef} from "react";
import "./IdeaCards.css";
import React from "react";
import {collection,query,where,getDocs, deleteDoc,doc,updateDoc} from "firebase/firestore";
import {db,auth} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Matter from "matter-js";
import { use } from "react";

function IdeaCards(){

    const { hobbyName}=useParams();
    
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
                prev.map(idea=>idea.id===selectedIdea.id ? {...idea, text: editedText} : idea

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

    //using matter-js from here
      const bubbleRef=useRef(null);
      const bubbleElements=useRef({});
      const engineRef=useRef(null);
      const runnerRef=useRef(null);
      const bubblesRef=useRef([]);
      const ideaMap = useRef({});

    useEffect(()=>{
        if(!bubbleRef.current) return;
        if(IdeaCards.length === 0) return;

        const {
            Engine,Render, Runner, Bodies, Composite 
        } = Matter;

            engineRef.current=Engine.create();
            const engine=engineRef.current;
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
            render.canvas.style.display ="none";

            runnerRef.current=Runner.create();
            Runner.run(runnerRef.current,engine);

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
                Render.stop(render);
                Runner.stop(runnerRef.current);
    
                render.canvas.remove();
                Object.values(bubbleElements.current).forEach(el=>{
                    el.remove();
                
                });
                bubbleElements.current={};
    
            };
        },[])

        useEffect(()=>{
            if(!engineRef.current) return;
            const{Bodies,Composite,Body}=Matter;

            const engine = engineRef.current;
            const world = engine.world;

          /*  bubblesRef.current.forEach(body=>{
                Composite.remove(world,body);
            });
            bubblesRef.current=[];*/

            const width = bubbleRef.current.clientWidth;
            const height = bubbleRef.current.clientHeight;

            IdeaCards.forEach((idea,index)=>{

                if(ideaMap.current[idea.id]) return;

                const size=80+Math.random()*70;

                //for arranging bubble in grid
                const columns = Math.ceil(Math.sqrt(IdeaCards.length));
                const spacingX = width/(columns+1);
                const spacingY = height/(columns+1);
                const row = Math.floor(index/columns);
                const col = index % columns;

                const startX = spacingX*(col+1)+(Math.random()-0.5)*40;
                const startY = spacingY*(row+1)+(Math.random()-0.5)*40;
                const body = Bodies.circle(
                    startX,startY,size/2,
                    {
                        restitution:0.95,
                        friction:0,
                        frictionAir:0.0005,
                        density:0.0005
                    }
                );
                body.idea = idea;
                body.size = size;
                Body.setVelocity(body,{
                    x:(Math.random()-0.5)*2,
                    y:(Math.random()-0.5)*2
                })

                Composite.add(world,body);
                ideaMap.current[idea.id]=body;

                bubblesRef.current=Object.values(ideaMap.current);

                //to recreate Html
                const el=document.createElement("div");
                el.className="idea-bubble";
                el.innerText=idea.text;
                el.onclick=()=>{
                    setSelectedIdea(idea);
                    setEditedText(idea.text);
                };

                bubbleRef.current.appendChild(el);

                bubbleElements.current[idea.id]=el;
                });

                //for animation loop
                let animationFrame;
                const animate=()=>{
                    bubblesRef.current.forEach((bubble)=>{
                        const el = bubbleElements.current[bubble.idea.id];

                        if(!el) return;

                        el.style.width = `${bubble.size}px`;
                        el.style.height = `${bubble.size}px`;
                        el.style.transform=
                        `translate(
                        ${bubble.position.x-bubble.size/2}px,
                        ${bubble.position.y-bubble.size/2}px
                        )`;
                    });
                    animationFrame=requestAnimationFrame(animate);
                };
                animate();
            }
            
        )
        },[IdeaCards]);



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


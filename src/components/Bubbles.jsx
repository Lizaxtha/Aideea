import { useEffect, useRef } from "react";
import Matter from "matter-js";

function Bubbles({ideas, onBubbleClick}){

    const containerRef=useRef(null);
    const engineRef=useRef(null);
    const runnerRef=useRef(null);


    const bubblesRef=useRef([]);
    const bubbleElements=useRef({});
    const ideaMap = useRef({});

    const animationRef=useRef(null);

    //runs engine
     useEffect(()=>{

        const {
            Engine,Render, Runner, Bodies, Composite 
        } = Matter;

         engineRef.current=Engine.create();
            const engine=engineRef.current;
            engine.gravity.y=0;

            const render = Render.create({
                element:containerRef.current,
                engine,
                options: {
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                    wireframes:false,
                    background:"transparent"
                }
            });

            Render.run(render);
            render.canvas.style.display ="none";

            runnerRef.current=Runner.create();
            Runner.run(runnerRef.current,engine);

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            const walls=[
                Bodies.rectangle(width/2, -20, width, 40, {isStatic:true}),
                Bodies.rectangle(width/2, height+20, width, 40, {isStatic:true}),
                Bodies.rectangle(-20, height/2, 40, height, {isStatic:true}),
                Bodies.rectangle(width +20, height/2, 40, height, {isStatic:true}),
            ];
            Composite.add(engine.world, walls);

            return()=>{
                Runner.stop(runnerRef.current);
                Render.stop(render);
                render.canvas.remove();
            }

     },[]);


     // for animation loop
     useEffect(()=>{

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
            animationRef.current=requestAnimationFrame(animate);
        }
        
        animate();

        return()=>{
            cancelAnimationFrame(animationRef.current);
        }

     },[]);

     //adding bubbles
     useEffect(()=>{

        if(!engineRef.current) return;

        const{Bodies, Composite, Body}=Matter;
        const world=engineRef.current.world;

        if(!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        ideas.forEach((idea,index)=>{
            if(ideaMap.current[idea.id]) return;

            const size =90;

            const columns = Math.ceil(Math.sqrt(ideas.length));
            const spacingX = width/(columns+1);
            const spacingY = height/(columns+1);
            const row = Math.floor(index/columns);
            const col = index % columns;

            const startX = spacingX*(col+1)+(Math.random()-0.5)*40;
            const startY = spacingY*(row+1)+(Math.random()-0.5)*40;

            const body = Bodies.circle(
                    startX, startY, size/2,
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

                Composite.add(world, body);
                ideaMap.current[idea.id] = body;

                bubblesRef.current.push(body);

                //to create/edit HTML

                let el = bubbleElements.current[idea.id];
                if(!el){
                    el = document.createElement("div");
                    el.className="idea-bubble";

                    el.onclick=()=>{
                        onBubbleClick(body.idea);
                    };

                    containerRef.current.appendChild(el);
                    bubbleElements.current[idea.id] = el;
                }
                el.innerText=idea.text;
             
        });

        //for remove bubbles that are deleted
        Object.keys(ideaMap.current).forEach((id)=>{
            const stillExists=ideas.some(
                idea=>idea.id===id
            );

            if(stillExists) return;
            const bubble=ideaMap.current[id];

            Composite.remove(world,bubble);
            bubbleElements.current[id]?.remove();

            bubblesRef.current=bubblesRef.current.filter(
                b=>b.idea.id !==id
            );

            delete bubbleElements.current[id];
            delete ideaMap.current[id];
        })

     },[ideas]);

    return(
    <>
        <div className="bubble-container" ref={containerRef}></div>
    </>
    );
}

export default Bubbles;

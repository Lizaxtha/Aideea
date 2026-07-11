import{useParams} from "react-router-dom";

function IdeaCards(){

    const { hobbyName}=useParams();

    return(
        <div>
            <h1>abc</h1>
<p>this is the hobby page</p>
        </div>
    );
}

export default IdeaCards;
import "./Home.css"
function Home() {
    return(
<>
<div className="Title">
<h1>Aideea</h1>
<p>Dump your creative ideas</p>
</div>

<div className="enter">
<input type="text" placeholder="Write down your idea!"/>
<button>Save</button>
{/* drop down list for choosing hobby */}
</div>

</>
    );
}

export default Home;
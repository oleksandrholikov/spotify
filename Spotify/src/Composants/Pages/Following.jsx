import { useState, useEffect } from "react";
import { Navbar } from "../Navbar";
import { Artist } from "../Elements/Artist";

export function Following() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(null);
  const [artists, setArtists] = useState(null);
  
  const artistClick = (artist) => {
    window.location.href = `/artists?id=${artist.id}`;    
  };
  useEffect(() => {
    const name = "userId";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return setUserId(parts.pop().split(";").shift());
  }, []);
  useEffect(() => {
    if (userId) {
      fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      }) //  API
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [userId]);
  useEffect(() => {
    if(userId){
      fetch("http://localhost:3000/following",{
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId
          }),
      }) //  API
        .then((response) => response.json())
        .then((data) => {
          setFollowing(data);                 
        })
        .catch((err) => {
          setError(err);          
        }); }
  }, [userId]);
  useEffect(() =>{
    if(!following) return;
    Promise.all(
      following.map(item=>
        fetch(`http://localhost:8000/artists/${item.artist_id}`).then((res) => res.json()
      ))      
    )
    .then((data)=>{
        // console.log("data: ",data);
        setArtists(data);
      }
    )
    .catch((err)=>{
        setError(err);
      }
    )
  }, [following])
  
//   console.log(following);
  if (loading) return <p>Loading...</p>;
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-self-center justify-center items-center gap-2 p-10 w-fit bg-[#131213] rounded-xl mx-20 shadow-lg  shadow-slate-700">
        <h2 className="text-4xl">My Followings</h2>
        <div className="flex flex-wrap justify-center items-center gap-5 p-10">
        {artists && artists.length >0 ? (
                  artists.map((artist)=>(
                    <Artist artist={artist} artistClick={artistClick}/>
                  ))
                ):(
                  <p>Loading...</p>
                )
              }
        </div>
          
      </div>
    </>
  );
}

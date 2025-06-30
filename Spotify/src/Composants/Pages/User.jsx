import { useState, useEffect } from "react";
import { Navbar } from "../Navbar";
import { Track } from "../Elements/Track";




export function User() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(null);
  const [myPlayList, setMyPlayList] = useState();
  const [myTracks, setMyTracks] = useState([])
  const[addTrack,setAddTrack] = useState({
    userId: null,
    trackId: null
  });
  useEffect(()=>{
    const name = "userId";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return setUserId(parts.pop().split(";").shift());
  }, [])
  useEffect(() => {
    if(userId){
      fetch("http://localhost:3000/user",{
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
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        }); }
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
  useEffect(()=>{
    if(!user) return;
    fetch("http://localhost:3000/playlist",{
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {playlistId:Number(user.playlistId)}
        ),    
    })
    .then((response) => response.json())
    .then((data) => {
      setMyPlayList(data);
    })
  }, [user])
  useEffect(()=>{
    if(!myPlayList) return;
    Promise.all(
      myPlayList.map(item=>
        fetch(`http://localhost:8000/tracks/${item.id_track}`).then((res) => res.json()
      ))      
    )
    .then((data)=>{
        // console.log("data: ",data);
        setMyTracks(data);
      }
    )
    .catch((err)=>{
        setError(err);
      }
    )
  },[myPlayList])
  const addTrackToPlaylist = (track) => {    
    setAddTrack({
      playlistId: user.playlistId,
      trackId: track.id
    })    
  }
  const goToFollowingList = () => {
    window.location.href = "/following";
  }
  useEffect(()=>{
    if(!addTrack.playlistId || !addTrack.trackId) return;
    fetch('http://localhost:3000/addTrack',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addTrack),
    })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      alert(data);
    })
    .catch((err) => {
      setError(err);     
    })
    
  }, [addTrack])
  // console.log("ID: ", userId)
  // console.log(user);
  // console.log(following);
  // console.log(myPlayList);
  // console.log(myTracks);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Navbar />
      <div>
        <div className="flex items-center gap-10">
          <img
            className="rounded-full w-[7%] p-4"
            src="spoti-logo.svg"
            alt="Profile pic"
          />
          <div className="flex flex-col gap-2 items-start">
            <h2 className="text-5xl font-bold">{user.fullname}</h2>
            <span className="hover:text-green-500 cursor-pointer" onClick={goToFollowingList}>{ !Array.isArray(following) ? 0 : following.length} Followings</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 p-10">
          <h2 className="text-4xl self-start">My Playlist</h2>
            <section className="flex-1 bg-[#131213] rounded-lg p-2 w-full">
              <div className="flex items-center overflow-hidden w-full p-2">
                <ul className="flex min-md:flex-wrap  w-full max-md:flex-col -mx-2">
                     {myTracks && myTracks.length > 0 ? (
                        myTracks.map((track)=>(
                        <li className="min-md:w-1/3 p-2">
                        <Track track={track} addTrackToPlaylist={addTrackToPlaylist}/>
                        </li>
                        ))
                      ):(
                        <p>Loading...</p>
                      )
                    }               
                </ul>
              </div>
            </section>
          </div>
        </div>
    </>
  );
}

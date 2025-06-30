import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Navbar } from "../Navbar";
import { useState, useEffect, use } from "react";
import {Track} from "../Elements/Track";
import{Album} from "../Elements/Album";
import {Artist} from "../Elements/Artist";



library.add(fas, fab, far);

export function Home() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[albums, setAlbums] = useState(null);
  const[artists, setArtists] = useState(null);
  const[tracks, setTracks] = useState(null);
  const[index, setIndex] = useState(null);
  const[addTrack,setAddTrack] = useState({
    userId: null,
    trackId: null
  });
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
  useEffect(()=>{
      const name = "userId";
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return setUserId(parts.pop().split(";").shift());
    }, [])
  useEffect(()=>{
    const arr = [];
    for(let i = 0; i<9;i++){
      arr.push(Math.floor(Math.random() * 151) )
    }
    setIndex(arr);
  }, [])
  useEffect(()=>{
    fetch('http://localhost:3000/albums')
    .then((response) => response.json())
    .then((data) => {
      setAlbums(data);
    })
    .catch((err) => {
      setError(err);
      setLoading(false);
    });
  },[])
  useEffect(()=>{
    if(!index) return;
    Promise.all(
      index.map((id) =>
        fetch(`http://localhost:8000/artists/${id}`).then((res) => res.json())
      )
    )
        .then((data) => {
          setArtists(data);
        })
        .catch((err) => {
          setError(err);          
        });
    },[index])
  useEffect(()=>{
    if(!index) return;
    Promise.all(
      index.map((id) =>
        fetch(`http://localhost:8000/tracks/${id}`).then((res) => res.json())
      )
    )
      .then((data) => {
        setTracks(data);
      })
      .catch((err) => {
        setError(err);
      });   
  },[index])
  const handleClick = (album) => {
    window.location.href = `/albums?id=${album.id}`;
  };
  const artistClick = (artist) => {
    window.location.href = `/artists?id=${artist.id}`;    
  };
  const addTrackToPlaylist = (track) => {    
    setAddTrack({
      playlistId: user.playlistId,
      trackId: track.id
    })    
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
  const isFullyLoaded =
  user &&
  albums && albums.length === 15 &&
  artists && artists.length === 9 &&
  tracks && tracks.length === 9;
  // console.log('index: ',index);
  // console.log('albums: ', albums);
  // // console.log('artists: ', artists);
  // console.log(user)  
  if (!isFullyLoaded || loading ) return(
    <div className="h-screen flex flex-col items-center overflow-scroll">
        <Navbar />
        <main className="w-full"></main>
        <p>Loading...</p>
    </div>
  ) 
 
   
  return (
    <>
      <div className="h-screen flex flex-col items-center overflow-scroll">
        <Navbar />
        <main className="w-full">
          <div className="flex flex-col items-center gap-2 p-10 max-md:p-3">
            <h2 className="self-start text-3xl font-bold">Albums:</h2>
            <section className="overflow-x-scroll flex bg-[#131213] gap-10 p-5 rounded-lg w-full justify-start items-center" >
              {albums && albums.length ==15 ? (
                  albums.map((album)=>(
                    <Album album={album} handleClick={handleClick}/>
                  ))
                ):(
                  <p>Loading...</p>
                )
              }
            </section>
            <h2 className="self-start text-3xl font-bold">Artists:</h2>
            <section className="bg-[#131213] rounded-lg p-2 overflow-hidden w-full ">
              <div className="flex items-center overflow-x-scroll w-full p-2 gap-2">
              {artists && artists.length >0 ? (
                  artists.map((artist)=>(
                    <Artist artist={artist} artistClick={artistClick}/>
                  ))
                ):(
                  <p>Loading...</p>
                )
              }
              </div>
            </section>
            <h2 className="self-start text-3xl font-bold">Tracks:</h2>
            <section className="flex-1 bg-[#131213] rounded-lg p-2 w-full">
              <div className="flex items-center overflow-hidden w-full p-2">
                <ul className="flex min-md:flex-wrap  w-full max-md:flex-col -mx-2">
                  {tracks && tracks.length > 0 ? (
                    tracks.map((track)=>(
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
        </main>
      </div>
    </>
  );
}

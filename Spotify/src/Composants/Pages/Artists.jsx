import { useState, useEffect } from "react";
import { Navbar } from "../Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import{Album} from "../Elements/Album";
// import { useState } from "react";

library.add(fas, fab, far);

export function Artists() {
  const[userId, setUserId] = useState(null);
  const [artist, setArtist] = useState(null);
  const [artistInfo, setArtistInfo] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTr, setShowTr] = useState(false);
  const[follow, setFollow] =useState();
  const returnToList = (album) => {
    setTracks(null);
    setAlbum(null);
    setShowTr(false);
  };
  useEffect(()=>{
    const name = "userId";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return setUserId(parts.pop().split(";").shift());
  }, [])
  useEffect(() => {
    setArtist(window.location.href.split("=")[1]);
  }, []);
  useEffect(() => {
    if (!artist) return;
    console.log("artist:", artist);
    fetch(`http://localhost:8000/albums/artist/${artist}`)
      .then((response) => response.json())
      .then((data) => {
        setAlbums(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [artist]);
  useEffect(() => {
    if (!artist) return;
    fetch(`http://localhost:8000/artists/${artist}`)
      .then((response) => response.json())
      .then((data) => {
        setArtistInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [artist]);
  useEffect(() => {
    fetch(`http://localhost:8000/albums/${showTr}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setTracks(data.tracks);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [showTr]);
  useEffect(() => {
    if(!follow) return;
    fetch('http://localhost:3000/follow',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId:userId,
        artistId: follow
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      alert(data);
      setFollow(null);
    })
    .catch((err) => {
      setError(err);
    })
  }, [follow])
  if (tracks !== null && album !== null) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col gap-2 p-10 bg-[#131213] rounded-xl mx-20 shadow-lg items-start shadow-slate-700 w-fit">
          <button onClick={() => returnToList(album)} className="text-2xl hover:cursor-pointer flex justify-center items-center gap-2">
            <FontAwesomeIcon icon="fa-solid fa-chevron-left" />
            <p>Back</p>
            </button>
          <div className="flex flex-wrap justify-center items-center gap-2 p-10">
            <img
              className="rounded-full w-70 h-70 p-2"
              src={album.cover_small}
              alt={album.name}
            />
            <h3 className="text-4xl flex-1">
              {album.name} ( {new Date(album.release_date * 1000).toLocaleDateString("fr-FR")} )
            </h3>
          </div>
          <p className="text-xl">{album.description}</p>
          <ul className="flex flex-wrap gap-2 p-5 justify-start items-start">
            {tracks.map((track, index) => (
              <li key={track.id} className="h-1/5">
                <span>{track.name}</span>
                <audio src={track.mp3} controls={true}></audio>
              </li>
            ))}
          </ul>
        </div>{" "}
        `
      </>
    );
  }
  const handleClick = (album) => {
    console.log("Click on album:", album.id);
    setAlbum(album);
    setShowTr(album.id);
  };
  console.log("artist:", artist);
  console.log("info: ", artistInfo);
  if (loading || !artistInfo) return <p>Loading...</p>;
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-2 p-10 max-md:p-0 bg-[#131213] rounded-xl mx-20 max-md:mx-0 shadow-lg  shadow-slate-700 w-fit">
        <div className="flex flex-wrap justify-center items-center gap-2 p-10">
          <img
            className="w-[20%]"
            src={artistInfo.photo}
            alt={artistInfo.name}
          />
          <h2 className="text-9xl flex-1">{artistInfo.name}</h2>
        </div>
        <h4 className="text-2xl self-start hover:text-green-500 cursor-pointer" onClick={() => setFollow(artistInfo.id)}>Follow</h4>
        <p className="text-xl">{artistInfo.bio}</p>

        <h2 className="text-4xl self-start">Album List :</h2>
        <div id="albums" className="flex gap-2 p-10 items-start justify-start">
          {albums && albums.length > 0 ? (
            albums.map((album, index) => (
              <Album album={album} handleClick={handleClick} />
            ))
          ) : (
            <p>Any Albums</p>
          )}
        </div>
      </div>
    </>
  );
}

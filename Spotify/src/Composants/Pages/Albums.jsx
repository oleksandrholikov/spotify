import { Navbar } from "../Navbar";
import { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";

export function Albums() {
  const [cover, setCover] = useState(null);
  const [name, setName] = useState(null);
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState(null);
  // const [tracks, setTracks] = useState([]
  // const [tracks, setTracks] = useState([]);

  const id = window.location.href.split("=")[1];

  useEffect(() => {
    fetch(`http://localhost:8000/albums/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCover(data.album.cover);
        setName(data.album.name);
        setDate(data.album.release_date);
        setDescription(data.album.description);
        // setTracks(data.tracks);
        const tracksList = document.getElementById("tracks");
        tracksList.innerHTML = "";
        for (let i = 0; i < data.tracks.length; i++) {
          let li = document.createElement("li");
          li.className =
            "text-xl flex flex-col items-center gap-2 justify-center";
          let h3 = document.createElement("h3");
          h3.innerText = data.tracks[i].name;
          li.appendChild(h3);
          let audio = document.createElement("audio");
          audio.src = data.tracks[i].mp3;
          audio.controls = true;
          li.appendChild(audio);
          tracksList.appendChild(li);
        }
      });
  }, []);

  // document.getElementById("tracks").innerHTML = "";

  return (
    <>
      <Navbar />
      <div className="p-10 max-md:p-0">
        <div className="flex flex-col gap-2 p-10 max-md:p-0 bg-[#131213] rounded-xl mx-20 max-md:mx-0 shadow-lg  shadow-slate-700 w-fit">
          <div className="flex gap-2 items-center max-md:flex-col">
            <img className="rounded-full w-70 h-70 p-2" src={cover} alt="" />
            <h2 className="text-4xl">{name}</h2>
            <h3>{new Date(date * 1000).toLocaleDateString("fr-FR")}</h3>
          </div>
          <div>
            <p className="text-xl m-10 max-md:m-5">{description}</p>
            <ul
              id="tracks"
              className="flex flex-wrap gap-2 justify-start items-start"
            ></ul>
          </div>
        </div>
      </div>
    </>
  );
}

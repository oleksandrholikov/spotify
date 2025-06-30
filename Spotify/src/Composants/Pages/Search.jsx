import { Navbar } from "../Navbar";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { Albums } from "./Albums";

library.add(fas, fab, far);

export function Search() {
  const setFocus = (e) => {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "SELECT") {
      document.querySelectorAll("button").forEach((button) => {
        button.classList.remove("bg-slate-500");
      });
      document.querySelectorAll("select").forEach((button) => {
        button.classList.remove("bg-slate-500");
      });
      e.target.classList.add("bg-slate-500");
    }
  };
  const [data, setData] = useState(null);
  const [input, setInput] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(null);
  const [type, setType] = useState("album");
  const [genre, setGenre] = useState(null);
  const [album, setAlbum] = useState(null);
  const [artists, setArtists] = useState(null);
  const [albumId, setAlbumId] = useState(null);
  // const [list, setList] = useState()
  const [page, setPage] = useState({ page: 1, limit: 20 });
  if (page.page < 1) {
    setPage({ page: 1, limit: 20 });
  }
  // console.log("type: ",type)
  //   console.log("type: ",type);
  // console.log("search: ",search)
  useEffect(() => {
    const resList = document.getElementById("search-results");
    resList.innerHTML = "";
    if (search !== null) {
      fetch(`http://localhost:8000/search?query=${search}&type=${type}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          console.log("data: ", data);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [search, type]);

  useEffect(() => {
    if (albumId !== null) {
      let list = [];
      console.log("albumId: ", albumId);
      for (let i = 0; i < albumId.length; i++) {
        fetch(`http://localhost:8000/albums/${albumId[i]}`)
          .then((response) => response.json())
          .then((res) => {
            list.push(res.album);
          })
          .then(() => {
            console.log("list: ", list);
            if (list.length === albumId.length) {
              setData(list);
            }
          });
      }
      // console.log("list: ", list)
      // setData(list);
    }
  }, [albumId]);

  useEffect(() => {
    if (genre !== null) {
      fetch(`http://localhost:8000/genres/${genre}`)
        .then((response) => response.json())
        .then((data) => {
          setAlbumId(data.albums);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [genre, page]);

  useEffect(() => {
    if (album !== null) {
      fetch(
        `http://localhost:8000/albums?page=${page.page}&limit=${page.limit}`
      )
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          console.log("data: ", data);
        });
    } else if (artists !== null) {
      fetch(
        `http://localhost:8000/artists?page=${page.page}&limit=${page.limit}`
      )
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          console.log("data: ", data);
        });
    }
  }, [album, artists, page]);

  useEffect(() => {
    let size = 0;
    if (data !== null) {
      console.log("data: ", data);
      if (data[type + "s"]) {
        const res = data[type + "s"];
        size = res.length;
        console.log("res: ", res);
      } else {
        size = data.length;
      }
      const resList = document.getElementById("search-results");
      const arrows = document.createElement("div");
      let currentPage = document.createElement("span");
      if (genre != null) {
        if (page.page > 20) currentPage.innerText = page.page - 19;
        else currentPage.innerText = 1;
      } else {
        currentPage.innerText = page.page;
      }
      arrows.className = "flex self-center gap-2";
      const prev = document.createElement("span");
      prev.className =
        "rounded-full p-2 px-5 bg-black hover:cursor-pointer hover:bg-white hover:text-black";
      const next = document.createElement("span");
      if (data.length < page.limit) {
        next.addEventListener("click", () => {
          setPage({ page: page.page, limit: page.limit });
        });
      } else if (genre != null) {
        next.addEventListener("click", () => {
          setPage({ page: page.page + page.limit, limit: page.limit + 20 });
        });
        prev.addEventListener("click", () => {
          setPage({ page: page.page - page.limit, limit: page.limit - 20 });
        });
      } else {
        next.addEventListener("click", () => {
          setPage({ page: page.page + 1, limit: page.limit });
        });
        prev.addEventListener("click", () => {
          setPage({ page: page.page - 1, limit: page.limit });
        });
      }
      next.className =
        "rounded-full p-2 px-5 bg-black hover:cursor-pointer hover:bg-white hover:text-black";
      prev.innerText = "Prev";
      next.innerText = "Next";
      arrows.appendChild(prev);
      arrows.appendChild(currentPage);
      arrows.appendChild(next);
      resList.innerHTML = "";
      let ul = document.createElement("ul");
      ul.className = "flex flex-wrap gap-10";
      if (genre != null) {
        for (let i = page.page; i < page.limit; i++) {
          let li = document.createElement("li");
          li.className = "w-fit flex justify-center items-center";
          let a = document.createElement("a");
          let div = document.createElement("div");
          let img = document.createElement("img");
          let h3 = document.createElement("h3");
          if (data[i].cover) {
            a.href = `/albums?id=${data[i].id}`;
            img.src = data[i].cover_small;
            img.alt = data[i].name;
            div.appendChild(img);
            h3.innerText = data[i].name;
            div.appendChild(h3);
          } else if (data[i].photo) {
            a.href = `/artists?id=${data[i].id}`;
            img.src = data[i].photo;
            img.alt = data[i].name;
            div.appendChild(img);
            h3.innerText = data[i].name;
            div.appendChild(h3);
          }
          img.className = "w-50 h-50";
          a.className = " rounded-lg shadow-lg p-1 hover:cursor-pointer hover:shadow-slate-700 hover:bg-[#000000] hover:scale-110 transition delay-50 ease-in-out"
          div.className = "flex flex-col justify-center items-center"
          a.appendChild(div);
          li.appendChild(a);
          ul.appendChild(li);
          resList.appendChild(ul);
        }
      } else {
        for (let i = 0; i < size; i++) {
          let li = document.createElement("li");
          li.className = "w-fit flex justify-center items-center";
          let a = document.createElement("a");
          let div = document.createElement("div");
          let img = document.createElement("img");
          let h3 = document.createElement("h3");
          if (data[type + "s"] && data[type + "s"][i]) {
            a.href = `/${type + "s"}?id=${data[type + "s"][i].id}`;
            if (type === "album") {
              img.src = data[type + "s"][i].cover_small;
            } else {
              img.src = data[type + "s"][i].photo;
            }
            img.alt = data[type + "s"][i].name;
            div.appendChild(img);
            h3.innerText = data[type + "s"][i].name;
            div.appendChild(h3);
          } else {
            if (data[i].cover) {
              a.href = `/albums?id=${data[i].id}`;
              img.src = data[i].cover_small;
              img.alt = data[i].name;
              div.appendChild(img);
              h3.innerText = data[i].name;
              div.appendChild(h3);
            } else if (data[i].photo) {
              a.href = `/artists?id=${data[i].id}`;
              img.src = data[i].photo;
              img.alt = data[i].name;
              div.appendChild(img);
              h3.innerText = data[i].name;
              div.appendChild(h3);
            }
          }

          img.className = "w-50 h-50";
          a.className = " rounded-lg shadow-lg p-1 hover:cursor-pointer hover:shadow-slate-700 hover:bg-[#000000] hover:scale-110 transition delay-50 ease-in-out"
          div.className = "flex flex-col justify-center items-center"
          a.appendChild(div);
          li.appendChild(a);
          ul.appendChild(li);
          resList.appendChild(ul);
        }
      }
      resList.appendChild(arrows);
    }
  }, [data]);

  // async function SearchApiHandler(e) {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/search?query=${search}&type=album`
  //     );
  //     const json = await response.json();
  //     setData(json.albums);
  //     console.log(data);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  //   const resList = document.getElementById("search-results");
  //   resList.innerHTML = "";
  //   for (let i = 0; i < data.length; i++) {
  //     let li = document.createElement("li")
  //     let a = document.createElement("a")
  //     a.innerText = data[i].name
  //     li.appendChild(a)
  //     resList.appendChild(li)
  //   }
  // }
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <div className=" w-full" onClick={setFocus}>
        <Navbar />
        <form className="flex justify-center mb-3 gap-2" action="/search">
          <input
            onChange={(e) => {
              console.log(e.target.value);
              setInput(e.target.value);
            }}
            className="text-md border border-outline p-3 w-[30%] rounded-full"
            type="text"
            placeholder="What's the mood ?"
            name="search"
            id="search"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setSearch(input);
            }}
            className="bg-[#131213] rounded-full p-3 hover:cursor-pointer"
          >
            <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
          </button>
        </form>
        <ul className="flex gap-2 justify-center max-md:w-[30%]">
          {/* <li>
            <button
              className="btn rounded-full"
              value="album"
              onClick={(e) => {
                e.preventDefault();
                setType(e.target.value);
                setAlbum(e.target.value);
              }}
            >
              All
            </button>
          </li> */}
          {/* <li>
            <button className="btn rounded-full" value="tracks">
              Tracks
            </button>
          </li> */}
          <button
            className="btn rounded-full"
            value="album"
            onClick={(e) => {
              e.preventDefault();
              setArtists(null);
              setGenre(null);
              setPage({ page: 1, limit: 20 });
              setType(e.target.value);
              setAlbum(e.target.value);
            }}
          >
            Albums
          </button>
          <li></li>
          <li>
            <button
              className="btn rounded-full"
              value="artist"
              onClick={(e) => {
                e.preventDefault();
                setAlbum(null);
                setGenre(null);
                setPage({ page: 1, limit: 20 });
                setType(e.target.value);
                setArtists(e.target.value);
              }}
            >
              Artists
            </button>
          </li>
          <li>
            <select
              className="btn rounded-full"
              onChange={(e) => {
                e.preventDefault();
                setAlbum(null);
                setArtists(null);
                // setPage({ page: 1, limit: 20 });
                setType(e.target.value);
                setGenre(e.target.value);
                console.log("genre:" + genre);
              }}
            >
              <option value="null" default>
                Genre
              </option>
              <option value="1">Classical</option>
              <option value="2">New Age</option>
              <option value="3">Electronica</option>
              <option value="4">World</option>
              <option value="5">Ambient</option>
              <option value="6">Jazz</option>
              <option value="7">Hip Hop</option>
              <option value="8">Alt Rock</option>
              <option value="9">Electro Rock</option>
              <option value="10">Hard Rock</option>
            </select>
          </li>
        </ul>
        <div
          className="flex flex-col gap-2 justify-start items-start max-md:w-[30%] p-5 bg-[#131213] rounded-xl mx-10 mt-5 shadow-lg  shadow-slate-700"
          id="search-results"
        ></div>
      </div>
    </>
  );
}

//   const nextPage = () => {
//   setPagination((prev) => ({
//   start: prev.start + 10,
//   end: prev.end + 10,
//   }));

//   const prevPage = () => {
//   setPagination((prev) => ({
//   start: Math.max(prev.start - 10, 0),
//   end: Math.max(prev.end - 10, 10),
//   }));

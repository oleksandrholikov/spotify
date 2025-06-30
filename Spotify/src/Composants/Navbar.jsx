import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
// import { useState } from "react";

library.add(fas, fab, far);

// export function SetSearchType(e) {
//   const [type, setType] = useState("album");
//   setType(e.target.value)
//   return type;
// }

export function Navbar() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const settingsRef = useRef(null);
  const usernameRef = useRef(null);
  // const userPictureRef = useRef(null);

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
          usernameRef.current.innerText = data.fullname;
        });
    }
  }, [userId]);

  useEffect(() => {
    console.log(settingsRef.current);
    if (window.location.href.split("/")[3] !== "user") {
      settingsRef.current.classList.add("hidden");
    } else {
      settingsRef.current.classList.remove("hidden");
    }
  }, [settingsRef]);

  const buttonLogout = () => {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };
  // const [data, setData] = useState(null);
  // const [search, setSearch] = useState("");

  // async function SearchApiHandler(e) {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/search?query=${search}&type=album`
  //     );
  //     console.log(response);

  //     const json = await response.json();
  //     setData(json.albums);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  //   return data;
  // }

  return (
    <>
      <header className="w-full mb-5">
        <nav className="flex flex-wrap max-md:justify-self-center bg-[#131213] justify-between p-5 text-4xl max-md:text-2xl max-md:w-[90%]">
          <div className="flex gap-2">
            <div className="flex max-md:w-1/2 gap-2  max-md:hidden">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 hover:cursor-pointer hover:text-white"
              >
                <FontAwesomeIcon icon="fa-solid fa-chevron-left" />
              </button>
              <button
                onClick={() => navigate(1)}
                className="flex items-center gap-2 hover:cursor-pointer hover:text-white"
              >
                <FontAwesomeIcon icon="fa-solid fa-chevron-right" />
              </button>
            </div>
          <div className="flex gap-2 max-md:w-1/2">
            <a
              href="/home"
              className="flex text-xl items-center gap-2 shadow-slate-900 hover:text-white shadow-md  bg-[#000000] rounded-full p-3"
            >
              Home
              <FontAwesomeIcon icon="fa-solid fa-house" />
            </a>
            <a
              href="/search"
              className="flex text-xl shadow-slate-900 hover:text-white shadow-md items-center gap-2  bg-[#000000] rounded-full p-3"
            >
              Search
              <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
            </a>
            {/* <form
            className="flex gap-2 max-md:hidden"
            action="/search"
          >
            <input
              onChange={(e) => {
                console.log(e.target.value);
                setSearch(e.target.value);
              }}
              className="text-md border border-outline p-3 w-[100%] rounded-full"
              type="text"
              placeholder="What's the mood ?"
              name="search"
              id="search"
              />
              <button
              onClick={SearchApiHandler}
              className="bg-[#131213] rounded-full p-3 hover:cursor-pointer"
            >
              <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
            </button>
          </form> */}
          </div>
          </div>
          <div className="flex gap-2">
            <a
              href="/settings"
              ref={settingsRef}
              id="user-settings"
              className="flex items-center gap-2  max-md:hidden hover:cursor-pointer hover:text-white "
            >
              <FontAwesomeIcon icon="fa-solid fa-gear" />
            </a>
            <a
              href="/user"
              className="flex items-center gap-2 hover:cursor-pointer hover:text-white"
            >
              <span ref={usernameRef}>User</span>
              <FontAwesomeIcon icon="fa-regular fa-circle-user" />
            </a>
            <button
              onClick={buttonLogout}
              id="user-settings"
              className="flex items-center gap-2 hover:cursor-pointer hover:text-white"
            >
              <FontAwesomeIcon icon="justify-self-center fa-solid fa-power-off" />
            </button>
          </div>
          {/* <form
        </div>
        <button onClick={buttonLogout}>Log Out</button>
        <div className="flex gap-2">
          <a ref={settingsRef} href="/settings" className="flex items-center gap-2  max-md:hidden ">
            <FontAwesomeIcon icon="fa-solid fa-gear" />
          </a>
          <a href="/user" className="flex items-center gap-2 ">
            <FontAwesomeIcon icon="fa-regular fa-circle-user" />
          </a>
        </div>
        {/* <form
          className="flex w-full self-center justify-between items-center gap-2 min-md:hidden my-2"
          action="/search"
          method="get"
        >
          <input
            className="text-sm border border-outline p-1 w-[100%] h-fit rounded-full"
            type="text"
            placeholder="What's the mood ?"
            name="search"
            id="search"
          />
          <button className=" w-fit rounded-full p-1 hover:cursor-pointer">
          <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
          </button>
        </form> */}
        </nav>
      </header>
    </>
  );
}

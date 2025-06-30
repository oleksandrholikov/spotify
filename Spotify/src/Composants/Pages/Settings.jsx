import { useState, useEffect } from "react";
import { Navbar } from "../Navbar";

export function Settings() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [changes, setChanges] = useState({});
  const [save, setSave] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(user)
  // console.log(userId)

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
    // console.log('changes:', changes)
    if (changes.length !== 0 && save) {
      fetch("http://localhost:3000/changes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          changes,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
          setChanges({});
          location.reload();
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [save]);

  if (loading) return <p>Loading...</p>;
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-self-center justify-center items-center gap-2 p-10 w-fit bg-[#131213] rounded-xl mx-20 shadow-lg  shadow-slate-700">
        <h2 className="text-4xl">Update Informations</h2>
        <input
          required
          placeholder={user.fullname}
          className="border-2 shadow-slate-700 shadow-md bg-[#000000] focus:outline-none rounded-full p-1 min-xl:p-2"
          type="text"
          id="fullName"
          onChange={(e) => setChanges({ ...changes, fullname: e.target.value })}
        />
        <input
          required
          placeholder={user.email}
          className="border-2 shadow-slate-700 shadow-md bg-[#000000] focus:outline-none rounded-full p-1 min-xl:p-2"
          type="text"
          id="email"
          onChange={(e) => setChanges({ ...changes, email: e.target.value })}
        />
        <input
          required
          placeholder="New Password"
          className="border-2 shadow-slate-700 shadow-md bg-[#000000] focus:outline-none rounded-full p-1 min-xl:p-2"
          type="password"
          id="password"
          onChange={(e) => setChanges({ ...changes, password: e.target.value })}
        />
        <button
          className="btn rounded-full"
          onClick={(e) => {
            e.preventDefault();
            setSave(true);
          }}
        >
          Save
        </button>
      </div>
    </>
  );
}

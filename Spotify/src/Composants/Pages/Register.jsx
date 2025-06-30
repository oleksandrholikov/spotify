import { Form } from "../Form";
import { useState } from "react";

export function Register() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");

  console.log(fullname, username, email, password, birthdate);
  const createUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          username,
          email,
          password,
          birthdate,
        }),
      });

      if (response.ok) {
        alert("New User Created!");
        window.location.href = "/login";
      } else if (response.statusText == "Conflict") {
        console.log(response);
        alert("User already exists!");
      } else {
        alert("Error Creating User");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error sending data");
    }
  };
  return (
    <>
      <div className="flex flex-col gap-3 items-center min-md:justify-center max-md:py-2 h-screen">
        <div className="bg-[#131213] rounded-lg py-10 px-5 max-md:w-[90%] w-fit shadow-slate-700 shadow-md">
          <Form
            formTitle="Register"
            submitMessage="Register"
            buttonEvent={createUser}
          >
            <div className="flex flex-col gap-5 max-xl:text-lg min-xl:text-2xl p-10 max-md:p-0">
              <input
                required
                placeholder="Full Name"
                className="border-2 shadow-slate-700 shadow-md bg-[#000000] focus:outline-none rounded-full p-2 min-xl:p-5"
                type="text"
                id="fullName"
                onChange={(e) => setFullname(e.target.value)}
              />
              <input
                required
                className="border-2 bg-[#000000] shadow-slate-700 shadow-md focus:outline-none rounded-full p-2 min-xl:p-5"
                type="date"
                id="date"
                name="birthday"
                onChange={(e) => setBirthdate(e.target.value)}
              />
              <input
                required
                placeholder="Username"
                className="border-2 shadow-slate-700 shadow-md bg-[#000000] focus:outline-none rounded-full p-2 min-xl:p-5"
                type="text"
                id="username"
                onChange={(e) =>
                  setUsername(
                    e.target.value[0] === "@"
                      ? e.target.value.slice(1)
                      : e.target.value
                  )
                }
              />
              <input
                required
                placeholder="Email"
                className="border-2 shadow-slate-700 shadow-md bg-[#000000] focus:outline-none rounded-full p-2 min-xl:p-5"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                required
                placeholder="Password"
                className="border-2 shadow-slate-700 shadow-md bg-[#000000] focus:outline-none rounded-full p-2 min-xl:p-5"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <span className="max-xl:text-lg min-xl:text-2xl">
              Already have an account?{" "}
              <a className="text-blue-400 hover:underline" href="/login">
                Login
              </a>
            </span>
          </Form>
        </div>
      </div>
    </>
  );
}

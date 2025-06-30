import { useState } from "react";
import { Form } from "../Form";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  console.log(email, password);
  const logInUser= async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if(response.ok){
        window.location.href = '/home';
      }
      if(response.statusText =="Conflict"){
        console.log(response)
        setPassword('');
      alert('Username/Email or Password incorrect')}

  }catch (error) {
    console.error('Error:', error);
    setEmail('');
    setPassword('');
    alert('There was an error sending data');
  }
}
  return (
    <>
      <div className="flex flex-col gap-3 items-center min-md:justify-center max-md:py-2 h-screen">
        <div className="align-self-center justify-self-center bg-[#131213] rounded-lg py-10 px-5 max-md:w-[90%] w-fit shadow-slate-700 shadow-md">

          <Form formTitle="Login" submitMessage="Let's rock !" buttonEvent={logInUser}>
            <div className="flex max-lg:flex-col max-lg:items-center justify-center gap-5 py-5">

              <input
                className="border-2 shadow-slate-700 shadow-md bg-[#000000] focus:outline-none rounded-full p-2 min-xl:p-5"
                type="text"
                name="email"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value[0] === "@" ? e.target.value.slice(1) : e.target.value)}
              />
              <input
                className="border-2 shadow-slate-700 shadow-md bg-[#000000] focus:outline-none rounded-full p-2 min-xl:p-5"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <span className="max-xl:text-lg min-xl:text-2xl">
              Don'namet have an account? <a className="text-blue-400 hover:underline" href="/register">Register</a>
            </span>
          </Form>
        </div>
      </div>
    </>
  );
}
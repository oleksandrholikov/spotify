import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./Composants/ProtectedRoute.jsx";
import { Home } from "./Composants/Pages/Home";
import { Albums } from "./Composants/Pages/Albums";
import { Artists } from "./Composants/Pages/Artists";
import { User } from "./Composants/Pages/User";
import { Register } from "./Composants/Pages/Register";
import { Login } from "./Composants/Pages/Login";
import { Search } from "./Composants/Pages/Search";
import { Settings } from "./Composants/Pages/Settings";
import { Following } from "./Composants/Pages/Following.jsx";



function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/user" element={<User />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/following" element={<Following />} />
        </Route>
        
        
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

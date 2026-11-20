import { Routes, Route, NavLink } from "react-router-dom";
import Chat from "./pages/Chat";
import About from "./pages/About";
import "./App.css";

export default function App() {
  return (
    <>
      <nav className="site-nav">
        <NavLink to="/" end>Chat</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
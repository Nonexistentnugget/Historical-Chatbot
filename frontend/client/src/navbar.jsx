// navbar funtion

import React from "react";
import "./navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/">How to Play</a></li>
                <li><a href="/">About</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
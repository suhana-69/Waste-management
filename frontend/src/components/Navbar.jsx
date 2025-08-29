import React from "react";
import { useHistory } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const history = useHistory();

  const goToLogin = () => history.push("/login");
  const goToSignup = () => history.push("/signup");

  return (
    <nav className="navbar">
      <div className="logo">CloudCrumbs</div>

      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/#how">How It Works</a></li>
        <li><a href="/#impact">Impact</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>

      <div className="nav-buttons">
        <button onClick={goToLogin} className="btn">Login</button>
        <button onClick={goToSignup} className="btn btn-outline">Signup</button>
      </div>
    </nav>
  );
}

export default Navbar;

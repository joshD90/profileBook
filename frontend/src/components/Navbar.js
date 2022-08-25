import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LoggedInContext } from "../App.js";
import axios from "axios";

function Navbar() {
  //use context allows us to tap into a variable from child to parent.
  //this allows our navbar to be affected by changes that happen in the
  //login page.  This is done through wrapping routes in the app module
  //in a use context
  const { userLoggedIn, setUserLoggedIn } = useContext(LoggedInContext);
  //this logs us out if we are logged in.
  function shouldLogout() {
    if (userLoggedIn) {
      axios.post("/api/profile/logout").then((response) => {
        if (response.status == 500) return console.log(response.status);
        setUserLoggedIn(false);
        return console.log("you have been logged out");
      });
    }
  }
  return (
    <nav className="main-nav">
      <div className="nav-logo">profileBook</div>
      <div className="nav-links">
        <ul>
          <li>
            <Link to="/" className="Link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="Link">
              About
            </Link>
          </li>
          <li>
            {/* This changes depending on whether user is logged in.  If they are already logged
          in then the buttun will direct towards logout */}
            <Link to="/login" className="Link" onClick={shouldLogout}>
              <button className="btn btn-danger btn-sm">
                {userLoggedIn ? "Logout" : "Login"}
              </button>
            </Link>
          </li>
          <li>
            <Link to="/signup" className="Link">
              <button className="btn btn-success btn-sm">Sign-Up</button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
//All my own Page Imports which the router will link to
import Home from "./pages/Home.js";
import EditProfile from "./pages/EditProfile.js";
import Login from "./pages/Login.js";
import Profile from "./pages/Profile.js";
import SearchResult from "./pages/SearchResult.js";
import Signup from "./pages/Signup.js";
import About from "./pages/About.js";
import SingleBlog from "./pages/SingleBlog.js";
import EditBlog from "./pages/EditBlog.js";

//import nav component
import Navbar from "./components/Navbar.js";

export const LoggedInContext = React.createContext();

//App component to deal with Routing and navbar / footer
//footer has not been added yet
function App() {
  //use context allows us to pass around variables from child to parent once they are within
  //the context.provider wrapper
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <>
      <Router>
        <LoggedInContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/searchresult" element={<SearchResult />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/profile/:id/edit" element={<EditProfile />} />
            <Route path="/profile/:id/blog/:blogId" element={<SingleBlog />} />
            <Route
              path="/profile/:id/blog/:blogId/edit"
              element={<EditBlog />}
            />
          </Routes>
        </LoggedInContext.Provider>
      </Router>
    </>
  );
}

export default App;

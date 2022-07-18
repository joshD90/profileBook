import React from "react";
import SearchForm from "../components/SearchForm.js";

//Home component is fairly lightweight, it included SearchForm which
//allows user to search for various profiles under different criteria

function Home() {
  return (
    <div className="home-component-container">
      <h1>Welcome to Profile Book</h1>
      <p className="explanation-par">
        This site allows you to upload your own profile and search other
        profiles. You must be logged in to view other's profiles
      </p>
      <hr />
      <SearchForm />
    </div>
  );
}

export default Home;

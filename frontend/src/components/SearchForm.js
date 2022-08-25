import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//this carries out the search function
function SearchForm() {
  //lay out variables which will capture inputs
  const [criteria, setCriteria] = useState("fName");
  const [searchTerm, setSearchTerm] = useState();

  //set up use navigate hook
  const navigate = useNavigate();
  //function to capture user input
  function criteriaChange(event) {
    setCriteria(event.target.value);
  }
  function searchTermChange(event) {
    setSearchTerm(event.target.value);
  }
  //on click navigate to search result page, search result page will hit
  //the server end point.  Search criteria will be pass to next page via parameters
  function submitSearch(event) {
    event.preventDefault();
    navigate("/searchResult", {
      state: { criteria: criteria, searchTerm: searchTerm },
    });
  }
  return (
    <div className="search-div">
      <form>
        <h2 className="searchbar-header">Search Bar</h2>
        <div className="mb-3">
          <label htmlFor="criteria-select" className="form-label">
            Select Search Criteria
          </label>
          <select
            className="form-select"
            name="criteria-select"
            onChange={criteriaChange}
          >
            <option value="fName">First Name</option>
            <option value="sName">Last Name</option>
            <option value="fullName">Full Name</option>
            <option value="all">Return All Profiles</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="searchbar-input" className="form-label">
            Please Enter Your Search Here
          </label>
          <input
            className="form-control"
            name="searchbar-input"
            onChange={searchTermChange}
          ></input>
        </div>
        <button className="btn btn-lg btn-primary mt-4" onClick={submitSearch}>
          Submit Search
        </button>
      </form>
    </div>
  );
}

export default SearchForm;

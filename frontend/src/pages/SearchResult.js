import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProfileCard from "../components/ProfileCard.js";

function SearchResult() {
  const location = useLocation();
  const [resultList, setResultList] = useState([]);
  const [resultHeader, setResultHeader] = useState("Your Search Results");

  useEffect(() => {
    axios
      .post("/api/search", {
        criteria: location.state.criteria,
        searchTerm: location.state.searchTerm,
      })
      .then((response) => {
        //if the search result doesn't yield anything notify user
        if (response.data.length == 0) {
          setResultHeader("Could Not Find Any Profiles Matching that Criteria");
          console.log(resultHeader);
        }
        setResultList(response.data);
      })
      .catch((err) => console.log(err.response.data));
  }, []);

  return (
    <div className="text-center container mt-4">
      <h1>{resultHeader}</h1>
      <hr></hr>
      <div className="results-container">
        {resultList.map((result, index) => {
          return (
            <ProfileCard
              key={index}
              id={result._id}
              img={result.profilePath}
              fName={result.fName}
              sName={result.sName}
              email={result.email}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SearchResult;

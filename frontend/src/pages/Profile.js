import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BlogSpace from "../components/BlogSpace.js";

function Profile() {
  //set up our usestate constants which will hold our profile details
  const [profile, setProfile] = useState();
  const [fileName, setFileName] = useState();
  //this id is passed through the params
  const { id } = useParams();
  const navigate = useNavigate();
  //useEffect with empty dependency array at end allows us to run this only on load

  useEffect(() => {
    axios
      .get(`/api/profile/${id}`)
      .then((response) => {
        //first check did we get a profile object returned
        if (!response.data.fName) return;
        setProfile(response.data);
        //check to see whether there was a picture associated with the profile
        if (response.data.profilePath) {
          setFileName(
            response.data.profilePath.slice(
              response.data.profilePath.lastIndexOf("/"),
              response.data.profilePath.length
            )
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);
  //navigates to edit page
  function goToEdit() {
    navigate(`/profile/${id}/edit`);
  }
  //we need to check to see if we have gotten a response yet as the first
  //time the page renders the response hasn't come back leaving a lot of our
  //values as undefined
  return (
    <div>
      {profile ? (
        <div>
          <div className="profile-container">
            <div className="user-container">
              {fileName && (
                <img
                  src={profile && `/api/profile/image${fileName}`}
                  className="profile-pic"
                ></img>
              )}
              <div className="user-info-container">
                <h1>
                  {profile
                    ? profile.fName + " " + profile.sName
                    : "Please Log In to View This Page"}
                </h1>
                <p>Contact at:{profile.email}</p>
              </div>
              <div>
                {profile.isLoggedIn && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={goToEdit}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* covers the section of the page of things to do with blogs */}
          <BlogSpace profileId={id} />
        </div>
      ) : (
        <h1>You Must be Logged In to view this page</h1>
      )}
    </div>
  );
}

export default Profile;

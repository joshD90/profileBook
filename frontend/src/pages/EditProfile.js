import React, { useEffect, useState } from "react";
import CreateProfile from "../components/CreateProfile";
import { useParams } from "react-router-dom";
import axios from "axios";

function EditProfile() {
  //grabs id from the parameters
  const { id } = useParams();
  const [profile, setProfile] = useState();
  //hit the server end point on load with useEffect
  useEffect(() => {
    axios
      .get(`/api/profile/${id}`)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //this is something that might not be necessary as we are navigating directly after
  //getting a server response
  function setHeading() {
    console.log("heading set");
  }

  return (
    <div className="home-component-container">
      <h1>Edit Profile</h1>
      <CreateProfile setHeading={setHeading} value={profile} type="edit" />
    </div>
  );
}

export default EditProfile;

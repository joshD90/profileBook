import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfileCard(props) {
  const [shortPath, setShortPath] = useState("");
  const navigate = useNavigate();
  //on load, need to change the profile picture path to fit with our profile endpoint
  useEffect(() => {
    if (props.img) {
      setShortPath(
        props.img.slice(props.img.lastIndexOf("/"), props.img.length)
      );
    }
  });
  //navigates to single profile
  function viewProfile(event) {
    event.preventDefault();
    navigate(`/profile/${props.id}`);
  }

  return (
    <div className="card mb-4" style={{ width: 14 + "rem" }}>
      {shortPath && (
        <img
          className="card-img-top"
          // shortpath was sliced from information given through props
          src={`/api/profile/image${shortPath}`}
          alt="Profile Image"
        ></img>
      )}
      <div className="card-body">
        <h5 className="card-title">
          {props.fName} {props.sName}
        </h5>
        <p className="card-text">{props.email}</p>
        <button className="btn btn-sm btn-primary" onClick={viewProfile}>
          View Profile
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;

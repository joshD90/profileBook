import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../components/FormInput.js";
import axios from "axios";

function CreateProfile(props) {
  // Should I put these into an object and only have one constant and update with Spread Operators
  const [firstName, setFirstName] = useState();
  const [secondName, setSecondName] = useState();
  const [email, setEmail] = useState();
  const [file, setFile] = useState();
  const [value, setValue] = useState("");
  const [filename, setFilename] = useState();
  const [password, setPassword] = useState({
    password: "",
    passwordConfirm: "",
  });

  const { id } = useParams();

  let navigate = useNavigate();

  //could all these functions be modularised and called throughout the project
  function firstNameChange(event) {
    setFirstName(event.target.value);
  }
  function secondNameChange(event) {
    setSecondName(event.target.value);
  }
  function emailChange(event) {
    setEmail(event.target.value);
  }

  async function fileChange(event) {
    setFile(event.target.files[0]);
  }

  function passwordChange(event) {
    setPassword((prevState) => ({
      ...prevState,
      password: event.target.value,
    }));
  }

  function passwordConfirmChange(event) {
    setPassword((prevState) => ({
      ...prevState,
      passwordConfirm: event.target.value,
    }));
  }
  //submits the form
  function doSubmit(event) {
    event.preventDefault();
    //check if the two passwords match - if not don't continue with this function
    if (password.password != password.passwordConfirm) {
      props.setHeading("Passwords do not Match");
      return console.log("passwords do not match");
    }
    //send it all over by appending to FormData (FormData needed due to file)
    const formData = new FormData();
    formData.append("fName", firstName);
    formData.append("sName", secondName);
    formData.append("email", email);
    if (password.password != "") formData.append("password", password.password);
    //check if there is a file and append
    if (file) formData.append("userFile", file);
    //if we're editing there will be an existing document that we search for
    if (props.type === "edit") {
      formData.append("userId", id);
    }
    //send to server /api/profile/create or /api/profile/edit depending on type
    axios
      .post(`/api/profile/${props.type}`, formData)
      .then((res) => {
        if (res.data.id) {
          if (props.type === "create")
            props.setHeading("Successfully Created Your Profile");
          if (props.type === "edit")
            props.setHeading("You have Successfully Updated Your Profile");
          //navigates you to login (should there be a check to see whether it was successful)
          if (props.type === "edit") {
            navigate(`/profile/${res.data.id}`);
          } else navigate(`/login`);
        } else {
          props.setHeading("Error saving to Database, please try again");
        }
      })
      .catch((err) => {
        console.log(err);
        props.setHeading("Oops! Looks like something Went Wrong");
      });
  }
  //this is used for adding the values of the existing document to edit into the
  //input values
  useEffect(() => {
    console.log(props.value);
    if (props.value) {
      setValue(props.value);
      if (props.value.profilePath) {
        setFilename(
          props.value.profilePath.slice(
            props.value.profilePath.lastIndexOf("/"),
            props.value.profilePath.length
          )
        );
      }
    }
  });
  return (
    <form>
      <div className="search-div">
        {/* First Name Input */}
        <FormInput
          inputName="firstnameInput"
          labelValue="First Name"
          onChange={firstNameChange}
          value={value && value.fName}
        />
        {/* Second Name Input */}
        <FormInput
          inputName="secondNameInput"
          labelValue="Second Name"
          onChange={secondNameChange}
          value={value && value.sName}
        />
        {/* Email Input */}
        <FormInput
          inputName="emailInput"
          type="email"
          labelValue="Email *This will be your Username"
          onChange={emailChange}
          value={value && value.email}
        />
        {/* select profile pic */}
        <FormInput
          inputName="selectProfilePic"
          labelValue="Select Your Profile Picture"
          type="file"
          onChange={fileChange}
        />
        {props.value && (
          <div>
            <img
              src={filename && `/api/profile/image${filename}`}
              className="profile-preview mb-4"
            />
          </div>
        )}

        <hr className="mb-3"></hr>
        {/* Password Section */}
        <div className="form-password-div">
          <FormInput
            type="password"
            inputName="passwordInput"
            labelValue="Enter Password"
            onChange={passwordChange}
          />
          <FormInput
            type="password"
            inputName="passwordInputConfirm"
            labelValue="Confirm Password"
            onChange={passwordConfirmChange}
          />
        </div>

        <button className="btn btn-lrg btn-primary mb-3" onClick={doSubmit}>
          {props.type === "create" ? "Create Profile" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default CreateProfile;

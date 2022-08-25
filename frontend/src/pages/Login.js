import React, { useState, useContext, useEffect } from "react";
import { LoggedInContext } from "../App.js";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput.js";
import axios from "axios";

function Login() {
  const { userLoggedIn, setUserLoggedIn } = useContext(LoggedInContext);
  useEffect(() => {
    if (userLoggedIn) setUserLoggedIn(false);
  });
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginErrMsg, setLoginErrMsg] = useState();
  const navigate = useNavigate();
  //catches any changes in the input values
  function updateEmail(event) {
    setEmail(event.target.value);
  }
  function updatePassword(event) {
    setPassword(event.target.value);
  }

  function doLogin(event) {
    event.preventDefault();
    //send the information over in formData
    const loginInfo = new FormData();
    loginInfo.append("username", email);
    loginInfo.append("password", password);

    axios
      .post("/api/profile/login", loginInfo)
      .then((response) => {
        //needs to put in a handler in case wrong password or user does not
        //exist and update the state of the header
        console.log(response);
        setUserLoggedIn(true);
        navigate(`/profile/${response.data}`);
      })
      .catch((err) => {
        console.log(err);
        //we might get different response status depending on the flash
        //message based on the end point and will set the heading to alert user
        //cant find the profile
        if (err.response.status === 404) {
          setLoginErrMsg(err.response.data);
          return console.log(err.response.data, "email");
        }
        //password is wrong
        if (err.response.status === 401) {
          setLoginErrMsg(err.response.data);
          return console.log(err.response.data, "password");
        }
      });
  }

  return (
    <div className="home-component-container">
      <h1>{!loginErrMsg ? "Login" : loginErrMsg}</h1>
      <p>Use Email Address as User Name</p>
      <hr></hr>
      <div className="search-div">
        <form>
          <FormInput
            type="email"
            inputName="user-email"
            labelValue="Enter Email Address Here"
            onChange={updateEmail}
          />
          <FormInput
            type="password"
            inputName="user-password"
            labelValue="Enter Your Password"
            onChange={updatePassword}
          />
          <button onClick={doLogin} className="btn btn-lg btn-primary">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

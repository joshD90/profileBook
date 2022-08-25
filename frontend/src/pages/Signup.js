import React, { useState } from "react";
import CreateProfile from "../components/CreateProfile.js";

//This Page allows users to create a profile
function Signup() {
  const [heading, setHeading] = useState("It's never been Easier to Sign-Up");
  return (
    <div className="home-component-container">
      <h1 className="mb-4">{heading}</h1>
      <hr className="mt-4"></hr>
      {/* The create Profile is a reusable component that can be for editing or initial creation */}
      {/* Set heading will change the H1 of the Signup page to relect success or failure */}
      <CreateProfile setHeading={setHeading} type="create" />
    </div>
  );
}

export default Signup;

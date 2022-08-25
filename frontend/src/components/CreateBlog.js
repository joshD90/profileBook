import React, { useState } from "react";
import FormInput from "./FormInput.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//This Create Blog Function can either be for editing or for Making
//A blog depending on the props.type that is passed to it
function CreateBlog(props) {
  const [blogBody, setBlogBody] = useState();
  const [blogTitle, setBlogTitle] = useState();
  const [isPublic, setIsPublic] = useState(false);
  const [checkChange, setCheckChange] = useState(false);

  //set up navigate hook
  let navigate = useNavigate();
  //check for any changes in input values
  function blogBodyUpdate(event) {
    setBlogBody(event.target.value);
  }
  function updateBlogTitle(event) {
    setBlogTitle(event.target.value);
  }
  function checkBoxUpdate(event) {
    setIsPublic(event.target.checked);
    setCheckChange(true);
  }

  //trigger on create blog/save edit button
  function createBlog(event, type) {
    event.preventDefault();
    //compiles an object to send to server endpoint - if one input hasn't been
    //altered then it will come up as null at the endpoint and we must check for that
    let dataToSend = {
      blogTitle: blogTitle,
      blogBody: blogBody,
      profile_Id: props.profileId,
    };
    //We need to check to see if the checkbox has been changed to see whether to pass through the
    //end point - only do this check if type is edit
    if (type === "edit" && checkChange) {
      dataToSend.isPublic = isPublic;
    } else if ((type = "create")) dataToSend.isPublic = isPublic;
    //we need to send over the blog id to know which blog to edit.  Conditional on props.type being
    //edit as there will be no blog id already existing
    if (props.type === "edit") dataToSend.blogId = props.value._id;

    //hit our
    axios
      .post(`/api/blogs/${props.type}`, dataToSend)
      .then((response) => {
        console.log(response);
        //on response for create we call update action as we remain on the same page, just need to hide visibility
        //and then do a call request to the get('/blog') endpoint
        if (props.type === "create") props.updateAction();
        //if editing we can navigate away as the blog edit is on a separate page
        if (props.type === "edit")
          navigate(`/profile/${response.data.blog.profile[0]}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="container-md create-blog-form">
      <form>
        <FormInput
          inputName="blogTitle"
          labelValue="Blog Title"
          onChange={updateBlogTitle}
          value={props.value && props.value.title}
        />
        <FormInput
          type="textArea"
          labelValue="Blog Content"
          inputName="blogBody"
          cols="10"
          rows="04"
          onChange={blogBodyUpdate}
          value={props.value && props.value.body}
        />
        <FormInput
          type="checkbox"
          labelValue="Check this Box to Make Public"
          onChange={checkBoxUpdate}
          value={props.value && props.value.isPublic}
        />
        <div className="w-100 position-relative">
          <button
            className="btn btn-secondary btn-md"
            onClick={(e) => {
              createBlog(e, props.type);
            }}
          >
            {props.type === "create" ? "Create Blog" : "Save Edit"}
          </button>
          <button
            className="btn btn-secondary btn-md position-absolute end-0"
            onClick={props.onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBlog;

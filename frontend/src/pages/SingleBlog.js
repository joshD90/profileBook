import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";

function SingleBlog() {
  const { blogId } = useParams();
  const [blogContent, setBlogContent] = useState();
  const navigate = useNavigate();
  //on page load useEffect will run and grab the blog data from end point
  useEffect(() => {
    axios
      .get(`/api/blogs/${blogId}`)
      .then((response) => {
        setBlogContent(response.data.content);
      })
      .catch((error) => console.log(error.message));
  }, []);
  //any time we pass in the useState constants we need to check to see whether we have recieved our
  //server response as the page will render once before recieving the response and bring up undefined
  //errors
  return (
    <div>
      <div className="home-component-container">
        <h1 className="mb-4">{blogContent && blogContent.title}</h1>
        <hr></hr>
        <p>{blogContent && blogContent.body}</p>
      </div>
      <div className="blog-footer-div">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            navigate(`/profile/${blogContent && blogContent.profile[0]}`);
          }}
        >
          Return to Profile
        </button>
      </div>
    </div>
  );
}

export default SingleBlog;

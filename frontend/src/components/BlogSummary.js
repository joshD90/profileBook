import React from "react";
import { useNavigate } from "react-router-dom";

function BlogSummary(props) {
  //set up our use navigate
  const navigate = useNavigate();

  function readMore(event) {
    event.preventDefault();
    //this will navigate to the single page profile
    navigate(
      `/profile/${props.blogContent.profile[0]}/blog/${props.blogContent._id}`
    );
  }

  return (
    <div className="container-md blog-summary-div mb-4 position-relative">
      <h3>{props.blogContent.title}</h3>
      <p>{props.blogContent.body}</p>
      {/* check to see whether the logged in user is the profile associated with these blogs */}
      {props.isOwner && (
        <button
          className="btn btn-secondary btn-sm blog-edit-btn"
          onClick={() => {
            navigate(
              `/profile/${props.blogContent.profile[0]}/blog/${props.blogContent._id}/edit`
            );
          }}
        >
          Edit
        </button>
      )}
      <button
        className="btn btn-primary btn-sm blog-readmore-btn"
        onClick={readMore}
      >
        Read More
      </button>
    </div>
  );
}

export default BlogSummary;

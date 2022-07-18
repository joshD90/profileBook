import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateBlog from "../components/CreateBlog.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

function EditBlog(props) {
  //grab profile id and blogid from the params
  const { id, blogId } = useParams();
  const [blogValue, setBlogValue] = useState();

  const navigate = useNavigate();

  function closeEdit(event) {
    event.preventDefault();
    navigate(`/profile/${id}`);
  }
  //on loading page get the blog from our endpoint
  useEffect(() => {
    axios.get(`/api/blogs/${blogId}`).then((response) => {
      if (response.status === 200) setBlogValue(response.data);
    });
  }, []);
  return (
    <div className="home-component-container">
      <h1>Edit Profile</h1>
      {blogValue && (
        <CreateBlog
          onClose={closeEdit}
          value={blogValue.content}
          type="edit"
          profileId={id}
        />
      )}
    </div>
  );
}

export default EditBlog;

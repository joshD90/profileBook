import React, { useState, useEffect } from "react";
import BlogSummary from "../components/BlogSummary.js";
import axios from "axios";
import CreateBlog from "../components/CreateBlog.js";

function BlogSpace(props) {
  const [blogVisibility, setBlogVisibility] = useState("none");
  const [blogContent, setBlogContent] = useState([]);
  const [createFormVis, setCreateFormVis] = useState();
  const [shouldUpdateBlog, setShouldUpdateBlog] = useState(false);
  const [isBlogOwner, setIsBlogOwner] = useState(false);
  //this will get our blogs
  function getBlog() {
    axios
      .get(`/api/blogs/populateBlog/${props.profileId}`)
      .then((response) => {
        setBlogContent(response.data.blogs);
        setIsBlogOwner(response.data.isOwner);
      })
      .catch((err) => console.log(err));
  }
  //this sets our blogs on the page being first rendered
  useEffect(() => {
    getBlog();
  }, []);
  //this checks whether the blogs should be updated ie, another has been added
  useEffect(() => {
    getBlog();
  }, [shouldUpdateBlog]);
  //once we create the blog this should be called to re-hit the server propogation endpoint
  //to do this we simply change the state of the shouldUpdateBlog and this will trigger the
  //useeffect, we also hide the blog again
  function updateBlogs() {
    if (!shouldUpdateBlog) {
      setShouldUpdateBlog(true);
      setCreateFormVis(false);
    } else {
      setShouldUpdateBlog(false);
      setCreateFormVis(false);
    }
  }
  //if the show all blogs button is clicked this changes the visibility / display
  function expandBlogs(event) {
    event.preventDefault();
    if (blogVisibility === "none") {
      setBlogVisibility("block");
    } else setBlogVisibility("none");
  }
  //this brings up the create blog form overlay
  function createBlog(event) {
    event.preventDefault();
    if (createFormVis) {
      setCreateFormVis(false);
    } else {
      setCreateFormVis(true);
    }
  }

  return (
    <div style={{ padding: 3 + "rem" }}>
      <h1>This Is The Blog Space Area</h1>
      <div className="blogButtons">
        <button className="btn btn-secondary mt-4 mb-4" onClick={expandBlogs}>
          View All Blogs
        </button>
        {isBlogOwner && (
          <button className="btn btn-secondary mt-4 mb-4" onClick={createBlog}>
            Create
          </button>
        )}
      </div>
      {createFormVis && (
        <CreateBlog
          profileId={props.profileId}
          updateAction={updateBlogs}
          type="create"
        />
      )}
      {/* mapping the blogs array */}
      <div style={{ display: blogVisibility }}>
        {blogContent.map((blog, index) => {
          return (
            <BlogSummary key={index} blogContent={blog} isOwner={isBlogOwner} />
          );
        })}
      </div>
      {createFormVis && (
        <CreateBlog
          profileId={props.profileId}
          updateAction={updateBlogs}
          onClose={createBlog}
          type="create"
        />
      )}
    </div>
  );
}

export default BlogSpace;

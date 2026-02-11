import { useNavigate } from "react-router-dom";
import styles from "./editPost.module.css";
import { useState, useEffect } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

const EditPost = () => {
  const { auth, posts, id, editPost: changePost } = useContext(ItemContext);

  const [editPost, setEditPost] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const currentPost = posts.filter((post) => post.id == id);
    setEditPost({
      id: currentPost[0].id,
      title: currentPost[0].title,
      content: currentPost[0].content,
      published: currentPost[0].published,
    });
  }, [posts, id]);

  if (!posts || posts.length === 0 || editPost.length === 0) {
    return (
      <div className={styles.EditPost}>
        <h1>Loading post data or post not found...</h1>
      </div>
    );
  }
  function onChangeHandler(event) {
    const { name, value } = event.target;
    setEditPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  }

  function onChangePublish(event) {
    const { value } = event.target;
    setEditPost((prevPost) => ({
      ...prevPost,
      published: value,
    }));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editPost.title == "" || editPost.content == "") {
      return alert("You need to fill in all the field");
    }

    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/admin/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          title: editPost.title,
          content: editPost.content,
          published: editPost.published,
        }),
      });

      if (response.ok) {
        changePost({
          id: editPost.id,
          title: editPost.title,
          content: editPost.content,
          published: editPost.published,
        });
        navigate("/posts", { replace: true });
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  return (
    <div className={styles.EditPost}>
      {auth ? (
        <div className={styles.EditPostArticle}>
          <div style={{ display: "inline-block" }}>
            <label htmlFor="publish">
              <input
                type="radio"
                name="published"
                id="publish"
                value={true}
                onChange={onChangePublish}
              />
              Publish
            </label>
            <label htmlFor="draft" style={{ paddingLeft: "40px" }}>
              <input
                type="radio"
                name="published"
                id="draft"
                value={false}
                onChange={onChangePublish}
              />
              Draft
            </label>
          </div>
          <label htmlFor="title">
            Title:{" "}
            <input
              type="text"
              name="title"
              id="title"
              value={editPost.title}
              onChange={onChangeHandler}
              style={{ width: "400px" }}
            />
          </label>
          <label htmlFor="content">Content: </label>
          <textarea
            name="content"
            id="content"
            value={editPost.content}
            onChange={onChangeHandler}
          ></textarea>
          <button onClick={handleSubmit}>Submit changes</button>
        </div>
      ) : (
        <h1>
          LogIn To
          <br />
          Edit Post
        </h1>
      )}
    </div>
  );
};

export default EditPost;

import { useNavigate } from "react-router-dom";
import styles from "./createPost.module.css";
import { useState } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

const CreatePost = () => {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    published: true,
  });
  const { auth, addPost } = useContext(ItemContext);

  function onChangeHandler(event) {
    const { name, value } = event.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  }
  function onChangePublish(event) {
    const { value } = event.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      published: value,
    }));
  }
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPost.title == "" || newPost.content == "") {
      return alert("You need to fill in all the field");
    }

    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/admin/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          published: newPost.published,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        addPost({
          id: result.post[0].id,
          keyID: crypto.randomUUID(),
          title: result.post[0].title,
          content: result.post[0].content,
          published: result.post[0].published,
          createdAt: result.post[0].createdAt,
          userId: result.post[0].userId,
          publishedAt: result.post[0].publishedAt,
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
    <div className={styles.createPost}>
      {auth ? (
        <div className={styles.createPostArticle}>
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
              value={newPost.title}
              onChange={onChangeHandler}
              style={{ width: "400px" }}
            />
          </label>
          <label htmlFor="content">Content: </label>
          <textarea
            name="content"
            id="content"
            value={newPost.content}
            onChange={onChangeHandler}
          ></textarea>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <h1>
          LogIn To
          <br />
          Create A Post
        </h1>
      )}
    </div>
  );
};

export default CreatePost;

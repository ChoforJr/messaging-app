import { Link } from "react-router-dom";
import styles from "./posts.module.css";
import { useNavigate } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

const Posts = () => {
  const { auth, posts, comments, changePostState, deletePost } =
    useContext(ItemContext);
  const navigate = useNavigate();
  function getPost(event) {
    const { id } = event.currentTarget;
    navigate(`/posts/${id}`, { replace: false });
  }

  return (
    <div className={styles.posts}>
      <Link to="/createPost">
        <button style={{ backgroundColor: "#32CD32", width: "180px" }}>
          Create Post
        </button>
      </Link>

      {auth ? (
        posts.map((item) => (
          <article
            key={item.keyID}
            className={styles.postArticle}
            id={item.id}
            onClick={getPost}
          >
            <h2>
              {item.title}{" "}
              <div>
                <button
                  className={styles.postDelBtn}
                  onClick={(event) => deletePost(event, item.id)}
                >
                  Delete
                </button>{" "}
                <Link
                  to={{
                    pathname: `/editPost/${item.id}`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className={styles.postEdtBtn}>edit</button>
                </Link>
              </div>
            </h2>
            <p className={styles.content}>{item.content}</p>
            <p>Created On: {new Date(item.createdAt).toLocaleString()}</p>
            <p>
              Comments:{" "}
              {comments.filter((comment) => comment.postId === item.id).length}
            </p>
            {item.published ? (
              <div>
                <p style={{ color: "#ADFF2F" }}>
                  {" "}
                  Published On: {new Date(item.publishedAt).toLocaleString()}
                </p>
                <button
                  style={{ backgroundColor: "#DC143C" }}
                  onClick={(event) =>
                    changePostState(event, item.id, item.published)
                  }
                >
                  unpublish
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: "#DC143C" }}>Drafted</p>
                <button
                  style={{ backgroundColor: "#ADFF2F" }}
                  onClick={(event) =>
                    changePostState(event, item.id, item.published)
                  }
                >
                  Publish
                </button>
              </div>
            )}
          </article>
        ))
      ) : (
        <h1>
          LogIn To
          <br />
          See All Posts Info
        </h1>
      )}
    </div>
  );
};

export default Posts;

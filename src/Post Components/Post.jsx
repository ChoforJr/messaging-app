import styles from "./post.module.css";
import { useState, useEffect } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

const Post = () => {
  const [commenting, setCommenting] = useState("");
  const [currentComment, setCurrentComment] = useState([]);
  const [existingComment, setExistingComment] = useState("");
  const [existingCommentIds, setExistingCommentIds] = useState(0);
  const {
    auth,
    comments,
    id,
    posts,
    account,
    addComment,
    profiles,
    changeComment,
    deleteComment,
  } = useContext(ItemContext);

  const currentPost = posts.filter((post) => post.id == id);

  useEffect(() => {
    const newComments = comments.filter((comment) => comment.postId == id);
    setCurrentComment(newComments);
  }, [comments, id]);

  function changingComment(event) {
    event.preventDefault();
    const { value } = event.target;
    setCommenting(value);
  }

  function changingExistingComment(event) {
    event.preventDefault();
    const { value } = event.target;
    setExistingComment(value);
  }

  function changeExistingCommentId(commentId) {
    setExistingCommentIds(commentId);
  }

  function resetExistingComment() {
    setExistingCommentIds(0);
    setExistingComment("");
  }

  async function submitComment(event) {
    event.preventDefault();

    if (commenting == "") {
      return alert("You can't submit an empty field");
    }

    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/user/post/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          content: commenting,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        addComment({
          id: result.comment[0].id,
          keyID: crypto.randomUUID(),
          content: result.comment[0].content,
          userId: result.comment[0].userId,
          postId: result.comment[0].postId,
          createdAt: result.comment[0].createdAt,
        });
        setCommenting("");
      } else {
        const result = await response.json();
        console.error(result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  async function submitEditedComment(event, commentId) {
    event.preventDefault();

    if (existingComment == "") {
      return alert("You can't submit an empty field");
    }

    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/user/post/comment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          content: existingComment,
        }),
      });

      if (response.ok) {
        changeComment({
          id: commentId,
          content: existingComment,
        });
        resetExistingComment();
      } else {
        const result = await response.json();
        console.error(result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <div className={styles.post}>
      {auth ? (
        <>
          <article key={currentPost[0].keyID} className={styles.postArticle}>
            <h2>{currentPost[0].title}</h2>
            <div className={styles.content}>{currentPost[0].content}</div>
          </article>
          <hr />
          <div className={styles.commenting}>
            <input
              type="text"
              name="currentComment"
              id="currentComment"
              placeholder="commenting..."
              value={commenting}
              onChange={changingComment}
            />
            <button onClick={submitComment}>Submit</button>
          </div>
          <article className={styles.comments}>
            <p>Comments</p>
            {currentComment.map(
              (comment) =>
                comment.postId == id && (
                  <div key={comment.keyID} className={styles.comment}>
                    {profiles.map(
                      (profile) =>
                        profile.userId == comment.userId && (
                          <p style={{ color: "GrayText" }} key={profile.keyID}>
                            {profile.displayName} said on{" "}
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        )
                    )}
                    <p>{comment.content}</p>
                    {existingCommentIds == comment.id && (
                      <div>
                        <input
                          type="text"
                          name="editingComment"
                          id="editingComment"
                          value={existingComment}
                          onChange={changingExistingComment}
                        />
                        <button
                          className={styles.commentDelBtn}
                          onClick={resetExistingComment}
                        >
                          Cancel
                        </button>{" "}
                        <button
                          style={{ color: "green" }}
                          onClick={(event) =>
                            submitEditedComment(event, comment.id)
                          }
                        >
                          Submit
                        </button>
                      </div>
                    )}
                    <div>
                      <button
                        className={styles.commentDelBtn}
                        onClick={(event) => deleteComment(event, comment.id)}
                      >
                        Delete
                      </button>{" "}
                      {account.id == comment.userId && (
                        <button
                          className={styles.commentEdtBtn}
                          onClick={() => changeExistingCommentId(comment.id)}
                        >
                          edit
                        </button>
                      )}
                    </div>
                  </div>
                )
            )}
          </article>
          <hr />
        </>
      ) : (
        <h1>
          LogIn To
          <br />
          See Post Info
        </h1>
      )}
    </div>
  );
};

export default Post;

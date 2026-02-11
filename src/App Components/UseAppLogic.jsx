import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

export function useAppLogic() {
  const { id } = useParams();
  const [auth, setAuth] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [account, setAccount] = useState([]);
  const [comments, setComments] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const authToken = localStorage.getItem("authorization");

    async function getComments() {
      try {
        const response = await fetch(`${apiUrl}/comments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const neededItems = result.comments.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            content: item.content,
            userId: item.userId,
            postId: item.postId,
            createdAt: item.createdAt,
          };
        });
        setComments(neededItems);
      } catch (error) {
        console.error("Network error:", error);
      }
    }
    getComments();

    async function getProfiles() {
      try {
        const response = await fetch(`${apiUrl}/profiles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const neededItems = result.profiles.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            userId: item.userId,
            displayName: item.displayName,
            bio: item.bio,
            createdAt: item.createdAt,
          };
        });
        setProfiles(neededItems);
      } catch (error) {
        console.error("Network error:", error);
      }
    }
    getProfiles();

    if (authToken) {
      async function getUsers() {
        try {
          const response = await fetch(`${apiUrl}/admin/users`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `${authToken}`,
            },
          });
          if (!response.ok) {
            if (response.status == 401) {
              setUsers([]);
              setAuth(false);
              localStorage.removeItem("authorization");
            }
            throw new Error(`Response status: ${response.status}`);
          }

          const result = await response.json();
          const neededItems = result.users.map((item) => {
            return {
              id: item.id,
              keyID: crypto.randomUUID(),
              username: item.username,
              createdAt: item.createdAt,
              role: item.role,
              displayName: item.profile.displayName,
              bio: item.profile.bio ? item.profile.bio : "None",
            };
          });

          setUsers(neededItems);
          setAuth(true);
        } catch (error) {
          console.error("Network error:", error);
        }
      }
      getUsers();

      async function getPosts() {
        try {
          const response = await fetch(`${apiUrl}/admin/post/all`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `${authToken}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }

          const result = await response.json();
          const neededItems = result.posts.map((item) => {
            return {
              id: item.id,
              keyID: crypto.randomUUID(),
              title: item.title,
              content: item.content,
              published: item.published,
              createdAt: item.createdAt,
              userId: item.userId,
              publishedAt: item.publishedAt,
            };
          });
          setPosts(neededItems);
        } catch (error) {
          console.error("Network error:", error);
        }
      }
      getPosts();
    }
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authorization");
    if (authToken && auth) {
      async function getAccountInfo() {
        try {
          const response = await fetch(`${apiUrl}/admin/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `${authToken}`,
            },
          });
          if (!response.ok) {
            if (response.status == 401) {
              setAccount([]);
              setAuth(false);
              localStorage.removeItem("authorization");
            }
            throw new Error(`Response status: ${response.status}`);
          }

          const result = await response.json();
          const neededItems = {
            id: result.adminInfo.id,
            keyID: crypto.randomUUID(),
            username: result.adminInfo.username,
            createdAt: result.adminInfo.createdAt,
            role: result.adminInfo.role,
            displayName: result.adminInfo.profile.displayName,
            bio: result.adminInfo.profile.bio,
          };

          setAccount(neededItems);
        } catch (error) {
          console.error("Network error:", error);
        }
      }
      getAccountInfo();
    }
  }, [auth]);

  function addPost(newPost) {
    setPosts((prevPosts) => {
      return [...prevPosts, newPost];
    });
  }
  function editPost(oldPost) {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) => {
        if (post.id == oldPost.id) {
          if (post.published == false && oldPost.published == true) {
            return {
              ...post,
              title: oldPost.title,
              content: oldPost.content,
              published: oldPost.published,
              publishedAt: new Date(),
            };
          } else if (post.published == true && oldPost.published == false) {
            return {
              ...post,
              title: oldPost.title,
              content: oldPost.content,
              published: false,
              publishedAt: null,
            };
          } else {
            return {
              ...post,
              title: oldPost.title,
              content: oldPost.content,
            };
          }
        }
        return post;
      });
      return updatedPosts;
    });
  }
  async function changePostState(event, id, currentPublished) {
    event.stopPropagation();
    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/admin/post/state/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          published: !currentPublished,
        }),
      });

      if (response.ok) {
        setPosts((prevPosts) => {
          const updatedPosts = prevPosts.map((post) => {
            if (post.id == id) {
              if (post.published == false) {
                return {
                  ...post,
                  published: true,
                  publishedAt: new Date(),
                };
              } else {
                return {
                  ...post,
                  published: false,
                };
              }
            }
            return post;
          });
          return updatedPosts;
        });
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
  async function deletePost(event, id) {
    event.stopPropagation();
    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/admin/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
      });

      if (response.ok) {
        setPosts((prevPosts) => {
          const updatedPosts = prevPosts.filter((post) => post.id != id);
          return updatedPosts;
        });
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  function addComment(newComment) {
    setComments((prevComments) => {
      return [...prevComments, newComment];
    });
  }
  function changeComment(newComment) {
    setComments((prevComments) => {
      const updatedComments = prevComments.map((comment) => {
        if (comment.id == newComment.id) {
          return {
            ...comment,
            content: newComment.content,
          };
        }
        return comment;
      });
      return updatedComments;
    });
  }
  async function deleteComment(event, id) {
    event.preventDefault();
    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/admin/post/comment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
      });

      if (response.ok) {
        setComments((prevComments) => {
          const updatedComments = prevComments.filter(
            (comment) => comment.id != id
          );
          return updatedComments;
        });
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  function changeAccountInfo(name, value) {
    setAccount((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  async function deleteUser(event, id) {
    event.preventDefault();
    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/admin/user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.filter((user) => user.id != id);
          return updatedUsers;
        });
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return {
    id,
    auth,
    setAuth,
    posts,
    addPost,
    editPost,
    changePostState,
    deletePost,
    comments,
    addComment,
    changeComment,
    deleteComment,
    users,
    account,
    changeAccountInfo,
    profiles,
    deleteUser,
  };
}

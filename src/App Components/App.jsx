import "./App.css";

import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useAppLogic } from "./UseAppLogic";

const App = () => {
  const {
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
  } = useAppLogic();

  const value = {
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
  return (
    <div className="container">
      <nav>
        <h1>
          <Link to="/">Chofor's Blog</Link>
        </h1>
        <section>
          <Link to="/">Home</Link>
          <Link to="/posts">Posts</Link>
          <Link to="/signIn">Sign In</Link>
          <Link to="/account">Account</Link>
          <Link to="/users">Users</Link>
        </section>
      </nav>
      <>
        <main>
          <ItemContext.Provider value={value}>
            <Outlet />
          </ItemContext.Provider>
        </main>
      </>
      <footer>
        Made by{" "}
        <a
          href="https://github.com/ChoforJr/admin-client-blog-api"
          target="_blank"
        >
          Chofor Forsakang
        </a>
      </footer>
    </div>
  );
};

export default App;

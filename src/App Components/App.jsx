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
          <Link to="/">
            <img src="/logo.jpg" alt="logo" width={25} />
            Messaging <span style={{ color: "#EE204D" }}>App</span>{" "}
          </Link>
        </h1>
        <section>
          <div>
            <select id="chats">
              <option selected>Chats</option>
              <option value="people">
                <Link to="/chats/people">People</Link>
              </option>
              <option value="group">
                <Link to="/chats/groups">Groups</Link>
              </option>
            </select>
          </div>
          <div>
            <select id="explore">
              <option selected>Explore</option>
              <option value="people">
                <Link to="/explore/people">People</Link>
              </option>
              <option value="group">
                <Link to="/explore/groups">Groups</Link>
              </option>
            </select>
          </div>
          <Link to="/account">Account</Link>
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
        <a href="https://github.com/ChoforJr/messaging-app" target="_blank">
          Chofor Forsakang
        </a>
      </footer>
    </div>
  );
};

export default App;

import "./App.css";

import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useAppLogic } from "./UseAppLogic";

const App = () => {
  const {
    auth,
    setAuth,
    account,
    refreshAccount,
    contacts,
    refreshContacts,
    explorePeople,
    refreshExplorePeople,
    memberGroups,
    refreshMemberGroups,
    exploreGroups,
    refreshExploreGroups,
    allProfiles,
    refreshAllProfiles,
    contactMessages,
    groupMessages,
    logout,
    refreshRecentContactMessages,
    refreshRecentGroupMessages,
  } = useAppLogic();

  const value = {
    auth,
    setAuth,
    account,
    refreshAccount,
    contacts,
    refreshContacts,
    explorePeople,
    refreshExplorePeople,
    memberGroups,
    refreshMemberGroups,
    exploreGroups,
    refreshExploreGroups,
    allProfiles,
    refreshAllProfiles,
    contactMessages,
    groupMessages,
    logout,
    refreshRecentContactMessages,
    refreshRecentGroupMessages,
  };
  return (
    <div className="container">
      <nav>
        <h1>
          <Link to="/">
            <img src="/logo.svg" alt="logo" width={40} />
            Messaging <span style={{ color: "#EE204D" }}>App</span>{" "}
          </Link>
        </h1>
        <section>
          <div className="dropdown">
            <button className="dropbtn">Chats</button>
            <div className="dropdown-content">
              <Link to="/chats/people">People</Link>
              <Link to="/chats/groups">Groups</Link>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropbtn">Explore</button>
            <div className="dropdown-content">
              <Link to="/explore/people">People</Link>
              <Link to="/explore/groups">Groups</Link>
            </div>
          </div>
          <button className="dropbtn">
            <Link to="/account">Account</Link>
          </button>
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

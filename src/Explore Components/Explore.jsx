import styles from "./explore.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

const apiUrl = import.meta.env.VITE_MESSAGING_APP_API_URL;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const ExplorePeople = () => {
  const { auth, explorePeople, refreshExplorePeople, refreshContacts } =
    useContext(ItemContext);

  const authToken = localStorage.getItem("authorization");

  const handleConnect = async (contactId) => {
    try {
      const response = await fetch(`${apiUrl}/user/profile/connect`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({ contactId }),
      });

      if (response.ok) {
        alert("Successfully connected!");
        refreshExplorePeople();
        refreshContacts();
        return true;
      } else {
        const result = await response.json();
        alert(result.errors?.[0]?.msg || result.error || "Connection failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while trying to connect");
    }
    return false;
  };

  return (
    <div className={styles.exploreBody}>
      {auth ? (
        explorePeople.map((item) => (
          <article
            key={item.keyID}
            className={styles.explorePeople}
            id={item.id}
          >
            <img src={item.photo} alt={item.displayName} />
            <div>
              <h2>{item.displayName}</h2>
              <p>{item.bio}</p>
              <button onClick={() => handleConnect(item.userId)}>follow</button>
            </div>
          </article>
        ))
      ) : (
        <h1>
          LogIn To
          <br />
          Interact with Page
        </h1>
      )}
    </div>
  );
};

export const ExploreGroups = () => {
  const { auth, exploreGroups, refreshExploreGroups, refreshMemberGroups } =
    useContext(ItemContext);

  const authToken = localStorage.getItem("authorization");

  const handleJoin = async (groupId) => {
    try {
      const response = await fetch(`${apiUrl}/group/join/${groupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
      });

      if (response.ok) {
        alert("Successfully joined group!");
        refreshExploreGroups();
        refreshMemberGroups();
        return true;
      } else {
        const result = await response.json();
        alert(result.errors?.[0]?.msg || result.error || "Join failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while trying to join the group");
    }
    return false;
  };
  return (
    <div className={styles.exploreBody}>
      {auth ? (
        exploreGroups.map((item) => (
          <article
            key={item.keyID}
            className={styles.exploreGroup}
            id={item.id}
          >
            <img src={item.profilePhoto} alt={item.name} />
            <div>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>Created On: {formatDate(item.createdAt)}</p>
              <button onClick={() => handleJoin(item.id)}>Join</button>
            </div>
          </article>
        ))
      ) : (
        <h1>
          LogIn To
          <br />
          Interact with Page
        </h1>
      )}
    </div>
  );
};

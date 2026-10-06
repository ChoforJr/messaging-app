import styles from "./explore.module.css";
import { useItemContext } from "../ItemContext";
import { API_URL } from "../lib/config";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const ExplorePeople = () => {
  const { auth, explorePeople, refreshExplorePeople, refreshContacts } =
    useItemContext();

  const authToken =
    typeof window === "undefined" ? null : window.localStorage.getItem("authorization");

  const handleConnect = async (contactId: string) => {
    try {
      const response = await fetch(`${API_URL}/user/profile/connect`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken ?? "",
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
        (explorePeople ?? []).map((item) => (
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
    useItemContext();

  const authToken =
    typeof window === "undefined" ? null : window.localStorage.getItem("authorization");

  const handleJoin = async (groupId: string) => {
    try {
      const response = await fetch(`${API_URL}/group/join/${groupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken ?? "",
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
        (exploreGroups ?? []).map((item) => (
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

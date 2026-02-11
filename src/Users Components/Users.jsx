import styles from "./users.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

const Users = () => {
  const { auth, users, deleteUser } = useContext(ItemContext);
  return (
    <div className={styles.users}>
      {auth ? (
        users.map((user) => (
          <div key={user.keyID} className={styles.userInfo}>
            <p>ID: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Display Name: {user.displayName}</p>
            <p>Role: {user.role}</p>
            <p>Bio: {user.bio}</p>
            <p>CreatedAt: {user.createdAt}</p>
            <button onClick={(event) => deleteUser(event, user.id)}>
              Delete
            </button>
            <hr width="1000px" />
          </div>
        ))
      ) : (
        <h1>
          LogIn To
          <br />
          See Users Info
        </h1>
      )}
    </div>
  );
};

export default Users;

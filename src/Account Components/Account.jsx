import styles from "./account.module.css";
import { useState } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

const Account = () => {
  const { auth, account, changeAccountInfo } = useContext(ItemContext);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [changePassword, setChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  function onChangeDisplayName(event) {
    const { value } = event.target;
    setNewDisplayName(value);
  }

  function onChangeNewUsername(event) {
    const { value } = event.target;
    setNewUsername(value);
  }

  function onChangeNewBio(event) {
    const { value } = event.target;
    setNewBio(value);
  }

  function onChangeChangePassword(event) {
    const { name, value } = event.target;
    setChangePassword((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  async function submitNewDisplayName(event) {
    event.preventDefault();

    if (newDisplayName == "") {
      return alert("You can't submit an empty field");
    }

    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/user/displayName`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          newDisplayName: newDisplayName,
        }),
      });

      if (response.ok) {
        changeAccountInfo("displayName", newDisplayName);
        setNewDisplayName("");
      } else {
        const result = await response.json();
        console.error(result);
        alert("Error, see console logs");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Error, see console logs");
    }
  }

  async function submitNewBio(event) {
    event.preventDefault();

    if (newBio == "") {
      return alert("You can't submit an empty field");
    }

    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/user/bio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          newBio: newBio,
        }),
      });

      if (response.ok) {
        changeAccountInfo("bio", newBio);
        setNewBio("");
      } else {
        const result = await response.json();
        console.error(result);
        alert("Error, see console logs");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Error, see console logs");
    }
  }

  async function submitNewUsername(event) {
    event.preventDefault();

    if (newUsername == "") {
      return alert("You can't submit an empty field");
    }

    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/user/username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          newUsername: newUsername,
        }),
      });

      if (response.ok) {
        changeAccountInfo("username", newUsername);
        setNewUsername("");
      } else {
        const result = await response.json();
        console.error(result);
        alert("Error, see console logs");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Error, see console logs");
    }
  }

  async function submitNewPassword(event) {
    event.preventDefault();

    if (
      changePassword.currentPassword == "" ||
      changePassword.newPassword == "" ||
      changePassword.confirmNewPassword == ""
    ) {
      return alert("You can't submit an empty field");
    }

    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          currentPassword: changePassword.currentPassword,
          newPassword: changePassword.newPassword,
          confirmNewPassword: changePassword.confirmNewPassword,
        }),
      });

      if (response.ok) {
        setChangePassword({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        const result = await response.json();
        console.error(result);
        alert("Error, see console logs");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Error, see console logs");
    }
  }

  return (
    <div className={styles.account}>
      {auth ? (
        <>
          <div key={account.keyID} className={styles.accountInfo}>
            <h1>ID: {account.id}</h1>
            <h1>Username: {account.username}</h1>
            <h1>Display Name: {account.displayName}</h1>
            <h1>Role: {account.role}</h1>
            <h1>Bio: {account.bio}</h1>
            <h1>CreatedAt: {account.createdAt}</h1>
          </div>
          <div className={styles.accountInfo}>
            <fieldset>
              <label htmlFor="newDisplayName">
                Change Display Name :{" "}
                <input
                  type="text"
                  name="newDisplayName"
                  id="newDisplayName"
                  value={newDisplayName}
                  onChange={onChangeDisplayName}
                />
              </label>
              <button onClick={submitNewDisplayName}>Change</button>
            </fieldset>
            <fieldset>
              <label htmlFor="newBio">
                Change Bio :{" "}
                <input
                  type="text"
                  name="newBio"
                  id="newBio"
                  value={newBio}
                  onChange={onChangeNewBio}
                />
              </label>
              <button onClick={submitNewBio}>Change</button>
            </fieldset>
            <fieldset>
              <label htmlFor="newUsername">
                Change Username :{" "}
                <input
                  type="email"
                  name="newUsername"
                  id="newUsername"
                  value={newUsername}
                  onChange={onChangeNewUsername}
                />
              </label>
              <button onClick={submitNewUsername}>Change</button>
            </fieldset>
            <fieldset
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <label htmlFor="currentPassword">
                Current Password :{" "}
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={changePassword.currentPassword}
                  onChange={onChangeChangePassword}
                />
              </label>
              <label htmlFor="newPassword">
                New Password :{" "}
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={changePassword.newPassword}
                  onChange={onChangeChangePassword}
                />
              </label>
              <label htmlFor="confirmNewPassword">
                Confirm New Password :{" "}
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  value={changePassword.confirmNewPassword}
                  onChange={onChangeChangePassword}
                />
              </label>
              <button onClick={submitNewPassword}>Change</button>
            </fieldset>
          </div>
        </>
      ) : (
        <h1>
          LogIn To
          <br />
          See Account Info
        </h1>
      )}
    </div>
  );
};

export default Account;

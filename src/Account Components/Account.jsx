import styles from "./account.module.css";
import { useState, useContext } from "react";
import { ItemContext } from "../ItemContext";

const apiUrl = import.meta.env.VITE_MESSAGING_APP_API_URL;

const Account = () => {
  const { auth, account, refreshAccount, logout } = useContext(ItemContext);

  const GUEST_ACCOUNTS = ["vegeta@gmail.com", "goku@gmail.com"];
  const isGuest = account ? GUEST_ACCOUNTS.includes(account.username) : false;

  const [newDisplayName, setNewDisplayName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const authToken = localStorage.getItem("authorization");

  const handlePatch = async (endpoint, body, successMsg) => {
    if (isGuest) return alert("Guest accounts cannot be modified.");
    try {
      const response = await fetch(`${apiUrl}/user/self/${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert(successMsg);
        refreshAccount();
        setNewDisplayName("");
        setNewBio("");
        setNewUsername("");
        return true;
      } else {
        const result = await response.json();
        alert(result.errors?.[0]?.msg || result.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  async function deletePhoto() {
    if (isGuest) return;
    try {
      const response = await fetch(
        `${apiUrl}/user/file/profile/photo/${account.photoId}`,
        {
          method: "DELETE",
          headers: { authorization: authToken },
        },
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          alert(err.error || "Delete failed");
        } else {
          alert("Delete failed: Server error");
        }
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  }

  const handlePhotoUpload = async (e) => {
    if (isGuest) return alert("Guest accounts cannot change photos.");
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("uploads", file);

    if (account.photoId) {
      await deletePhoto();
    }

    try {
      const response = await fetch(`${apiUrl}/user/file/profile/photo`, {
        method: "POST",
        headers: { authorization: authToken },
        body: formData,
      });

      if (response.ok) {
        refreshAccount();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          alert(err.error || "Upload failed");
        } else {
          alert("Upload failed: Server error");
        }
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (isGuest) return alert("Guest accounts cannot be deleted.");
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This action is permanent and will delete all your data.",
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`${apiUrl}/user/self`, {
          method: "DELETE",
          headers: { authorization: authToken },
        });

        if (response.ok) {
          alert("Account deleted successfully.");
          logout();
        } else {
          alert("Failed to delete account.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!auth || !account)
    return (
      <div className={styles.loginMsg}>
        <h1>Please Log In to see your account.</h1>
      </div>
    );

  return (
    <div className={styles.accountContainer}>
      {isGuest && (
        <div className={styles.guestNotice}>
          Viewing as <strong>Guest</strong>. Profile modifications are disabled.
        </div>
      )}
      <section className={styles.profileHeader}>
        <div className={styles.photoSection}>
          <img
            src={account.photo}
            alt="Profile"
            className={styles.profileImg}
          />
          {!isGuest && (
            <label className={styles.uploadBtn}>
              Change Photo
              <input
                type="file"
                hidden
                onChange={handlePhotoUpload}
                accept="image/png, image/jpeg"
              />
            </label>
          )}
        </div>
        <div className={styles.basicInfo}>
          <h2>{account.displayName}</h2>
          <p>{account.username}</p>
          <p>Joined: {new Date(account.createdAt).toLocaleDateString()}</p>
          <p>Bio: {account.bio || "No bio yet"}</p>
        </div>
      </section>

      <div
        className={`${styles.settingsGrid} ${isGuest ? styles.disabledArea : ""}`}
      >
        {/* Display Name */}
        <div className={styles.card}>
          <h3>Display Name</h3>
          <div className={styles.inputGroup}>
            <input
              disabled={isGuest}
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder={account.displayName}
            />
            <button
              disabled={isGuest}
              onClick={() =>
                handlePatch("displayName", { newDisplayName }, "Name updated!")
              }
            >
              Update
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className={styles.card}>
          <h3>Bio</h3>
          <div className={styles.inputGroup}>
            <textarea
              disabled={isGuest}
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder={account.bio || "Write something about yourself..."}
            />
            <button
              disabled={isGuest}
              onClick={() => handlePatch("bio", { newBio }, "Bio updated!")}
            >
              Update
            </button>
          </div>
        </div>

        {/* Username/Email */}
        <div className={styles.card}>
          <h3>Email Address</h3>
          <div className={styles.inputGroup}>
            <input
              type="email"
              disabled={isGuest}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={account.username}
            />
            <button
              disabled={isGuest}
              onClick={() =>
                handlePatch("userName", { newUsername }, "Username updated!")
              }
            >
              Update
            </button>
          </div>
        </div>

        {/* Password */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h3>Security</h3>
          <div className={styles.passwordFields}>
            <input
              type="password"
              disabled={isGuest}
              placeholder="Current Password"
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
            />
            <input
              type="password"
              disabled={isGuest}
              placeholder="New Password"
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
            <input
              type="password"
              disabled={isGuest}
              placeholder="Confirm New Password"
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirmNewPassword: e.target.value,
                })
              }
            />
            <button
              disabled={isGuest}
              onClick={() =>
                handlePatch("password", passwords, "Password changed!")
              }
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      <div className={styles.actionButtons}>
        <button className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      {!isGuest && (
        <section className={styles.dangerZone}>
          <h3>Danger Zone</h3>
          <p>Once you delete your account, there is no going back.</p>
          <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </section>
      )}
    </div>
  );
};

export default Account;

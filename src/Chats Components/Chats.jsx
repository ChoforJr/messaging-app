import styles from "./chats.module.css";
import { useState, useRef } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
import { UserMinus, Pencil, Download } from "lucide-react";
const apiUrl = import.meta.env.VITE_MESSAGING_APP_API_URL;

export const PeopleChats = () => {
  const {
    auth,
    account,
    contacts,
    refreshContacts,
    refreshExplorePeople,
    contactMessages,
    refreshRecentContactMessages,
  } = useContext(ItemContext);
  const [currentContact, setCurrentContact] = useState(null);
  const [messageType, setMessageType] = useState("text");
  const [messageText, setMessageText] = useState("");
  const authToken = localStorage.getItem("authorization");

  const handleUnfollow = async (e, contactID) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${apiUrl}/user/profile/disconnect`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({ contactId: contactID }),
      });
      if (response.ok) {
        refreshContacts();
        refreshExplorePeople();
        return true;
      } else {
        const result = await response.json();
        alert(result.errors?.[0]?.msg || result.error || "Connection failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while trying to connect");
    }
    return false;
  };

  function handleContactClick(e, contact) {
    e.stopPropagation();
    setCurrentContact(contact);
    refreshRecentContactMessages();
  }
  function clearMessages(e) {
    e.stopPropagation();
    setCurrentContact(null);
  }

  const SendImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("uploads", files[i]);
    }
    try {
      const response = await fetch(
        `${apiUrl}/message/image/chat/toUser/${currentContact.userId}`,
        {
          method: "POST",
          headers: { authorization: authToken },
          body: formData,
        },
      );

      if (response.ok) {
        refreshRecentContactMessages();
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

  const SendText = async () => {
    try {
      const response = await fetch(`${apiUrl}/message/text/toUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({
          content: messageText,
          toUserID: currentContact.userId,
        }),
      });

      if (response.ok) {
        refreshRecentContactMessages();
        setMessageText("");
      } else {
        const err = await response.json();
        alert(err.error || "Server error: Message not sent");
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  async function downloadFileFromUrl(url, filename) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error while downloading the file:", error);
    }
  }

  return (
    <div className={styles.chatBody}>
      {auth ? (
        <>
          <section className={styles.contacts}>
            {contacts &&
              contacts.map((contact) => (
                <div
                  key={contact.keyID}
                  className={styles.contact}
                  onClick={(e) => handleContactClick(e, contact)}
                >
                  <img src={contact.photo} alt={contact.displayName} />
                  <div>
                    <p>{contact.displayName}</p>
                    <button onClick={(e) => handleUnfollow(e, contact.userId)}>
                      Unfollow <UserMinus />
                    </button>
                  </div>
                </div>
              ))}
          </section>
          <section className={styles.messages}>
            {currentContact ? (
              <>
                <div
                  className={styles.messagesHeader}
                  onClick={(e) => clearMessages(e)}
                >
                  <img
                    src={currentContact.photo}
                    alt={currentContact.displayName}
                  />
                  <span>
                    Messages with {currentContact.displayName} (click to clear)
                  </span>
                </div>
                <div className={styles.messagesContainer}>
                  {contactMessages && contactMessages.length > 0
                    ? contactMessages
                        .filter(
                          (msg) =>
                            msg.toUserId === currentContact.userId ||
                            msg.authorId === currentContact.userId,
                        )
                        .sort(
                          (a, b) =>
                            new Date(a.createdAt) - new Date(b.createdAt),
                        )
                        .map((msg) => (
                          <div
                            key={msg.keyID}
                            className={`${styles.message} ${
                              msg.authorId === account?.id
                                ? styles.userMessage
                                : styles.contactMessage
                            }`}
                          >
                            {msg.content ? (
                              <div className={styles.messageText}>
                                <p>{msg.content}</p>
                                <span>
                                  {new Date(msg.createdAt).toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              msg.files.map((file) => (
                                <div
                                  key={file.keyID}
                                  className={styles.chatFile}
                                >
                                  <button
                                    type="button"
                                    className={styles.downloadBtn}
                                    onClick={() => {
                                      downloadFileFromUrl(
                                        file.photo,
                                        file.originalName,
                                      );
                                    }}
                                  >
                                    {file.originalName} <Download />
                                  </button>
                                  <span>
                                    {new Date(msg.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        ))
                    : null}
                </div>
                <div className={styles.sendMessageSection}>
                  {messageType === "text" ? (
                    <>
                      <button onClick={() => setMessageType("image")}>
                        Send Images instead
                      </button>
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                      />
                      <button type="button" onClick={SendText}>
                        Send
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setMessageType("text")}>
                        Send Text instead
                      </button>
                      <p>Remeber that only jpg and png files are allowed.</p>
                      <p>A File must be less than 1MB.</p>
                      <p>No more than 5 files can be uploaded at onces.</p>
                      <label className={styles.uploadBtn}>
                        Send images
                        <input
                          type="file"
                          hidden
                          onChange={SendImages}
                          accept="image/png, image/jpeg"
                          multiple
                        />
                      </label>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <h1>Select a contact to view messages</h1>
                <img
                  src="/conversation.svg"
                  alt="conversation"
                  className={styles.conversationImage}
                />
              </>
            )}
          </section>
        </>
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

export const GroupChats = () => {
  const {
    auth,
    account,
    allProfiles,
    memberGroups,
    refreshMemberGroups,
    refreshExploreGroups,
    groupMessages,
    refreshRecentGroupMessages,
  } = useContext(ItemContext);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [messageType, setMessageType] = useState("text");
  const [messageText, setMessageText] = useState("");
  const [createGroup, setCreateGroup] = useState({
    name: "",
    description: "",
  });
  const [editGroup, setEditGroup] = useState(null);

  const createGroupRef = useRef();
  const editGroupRef = useRef();

  const authToken = localStorage.getItem("authorization");

  const handleLeaveGroup = async (e, contactID) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${apiUrl}/group/leave/${contactID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({ contactId: contactID }),
      });
      if (response.ok) {
        refreshMemberGroups();
        refreshExploreGroups();
        return true;
      } else {
        const result = await response.json();
        alert(result.errors?.[0]?.msg || result.error || "Connection failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while trying to connect");
    }
    return false;
  };

  function handleGroupClick(e, contact) {
    e.stopPropagation();
    setCurrentGroup(contact);
    refreshRecentGroupMessages();
  }
  function clearMessages(e) {
    e.stopPropagation();
    setCurrentGroup(null);
  }

  const SendImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("uploads", files[i]);
    }
    try {
      const response = await fetch(
        `${apiUrl}/message/image/chat/toGroup/${currentGroup.id}`,
        {
          method: "POST",
          headers: { authorization: authToken },
          body: formData,
        },
      );

      if (response.ok) {
        refreshRecentGroupMessages();
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

  const SendText = async () => {
    try {
      const response = await fetch(`${apiUrl}/message/text/toGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify({
          content: messageText,
          toGroupID: currentGroup.id,
        }),
      });

      if (response.ok) {
        refreshRecentGroupMessages();
        setMessageText("");
      } else {
        const err = await response.json();
        alert(err.error || "Server error: Message not sent");
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  async function downloadFileFromUrl(url, filename) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error while downloading the file:", error);
    }
  }

  function onChangeGroupProp(e) {
    const { name, value } = e.target;
    setCreateGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const submitGroup = async () => {
    if (!createGroup.name || !createGroup.description) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/group/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify(createGroup),
      });

      if (response.ok) {
        refreshMemberGroups();
        refreshExploreGroups();
        setCreateGroup({ name: "", description: "" });
        createGroupRef.current.close();
      } else {
        const err = await response.json();
        alert(err.error || "Server error: Message not sent");
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  function closeCreateGroup() {
    setCreateGroup({ name: "", description: "" });
    createGroupRef.current.close();
  }

  function handleEditGroup(e, group) {
    e.stopPropagation();
    setEditGroup(group);
    editGroupRef.current.showModal();
  }

  function closeEditGroup() {
    setEditGroup(null);
    editGroupRef.current.close();
  }

  function onChangeEditGroupProp(e) {
    const { name, value } = e.target;
    setEditGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const submitEditGroup = async (prop) => {
    let editData;
    if (prop === "name") {
      if (!editGroup.name) {
        alert("Please fill in the name field");
        return;
      }
      editData = { name: editGroup.name };
    } else if (prop === "description") {
      if (!editGroup.description) {
        alert("Please fill in the description field");
        return;
      }
      editData = { description: editGroup.description };
    } else {
      alert("Invalid property to edit");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/group/${prop}/${editGroup.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        refreshMemberGroups();
        refreshExploreGroups();
        closeEditGroup();
      } else {
        const err = await response.json();
        alert(err.error || "Server error: Message not sent");
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  async function deletePhoto() {
    try {
      const response = await fetch(
        `${apiUrl}/group/file/group/photo/${editGroup.profilePhotoId}`,
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
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("uploads", file);

    if (editGroup.profilePhotoId) {
      await deletePhoto();
    }

    try {
      const response = await fetch(
        `${apiUrl}/group/file/group/photo/${editGroup.id}`,
        {
          method: "POST",
          headers: { authorization: authToken },
          body: formData,
        },
      );

      if (response.ok) {
        refreshMemberGroups();
        refreshExploreGroups();
        closeEditGroup();
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

  const handleDeleteGroup = async (e) => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This action is permanent and will delete all your data.",
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`${apiUrl}/group/delete/${editGroup.id}`, {
          method: "DELETE",
          headers: { authorization: authToken },
        });

        if (response.ok) {
          alert("Group deleted successfully.");
          refreshMemberGroups();
          refreshExploreGroups();
          closeEditGroup();
          clearMessages(e);
        } else {
          alert("Failed to delete group.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.chatBody}>
      {auth ? (
        <>
          <section className={styles.groups}>
            {memberGroups &&
              memberGroups.map((group) => (
                <div
                  key={group.keyID}
                  className={styles.contact}
                  onClick={(e) => handleGroupClick(e, group)}
                >
                  <img src={group.profilePhoto} alt={group.name} />
                  <div>
                    <p>{group.name}</p>
                    <button onClick={(e) => handleLeaveGroup(e, group.id)}>
                      Leave Group <UserMinus />
                    </button>
                    {account?.profileId === group.adminId && (
                      <button
                        onClick={(e) => handleEditGroup(e, group)}
                        className={styles.editGroupBtn}
                      >
                        <Pencil />
                      </button>
                    )}
                    <dialog
                      ref={editGroupRef}
                      className={styles.editGroupDialog}
                    >
                      <button onClick={closeEditGroup}>Close</button>
                      <label htmlFor="nameChange">
                        Change Name:{" "}
                        <input
                          type="text"
                          name="name"
                          id="nameChange"
                          placeholder="group name"
                          value={editGroup?.name || ""}
                          onChange={onChangeEditGroupProp}
                        />
                        <button onClick={() => submitEditGroup("name")}>
                          Submit Name Change
                        </button>
                      </label>
                      <label htmlFor="descriptionChange">
                        Change Description:{" "}
                        <input
                          type="text"
                          name="description"
                          id="descriptionChange"
                          placeholder="group description"
                          value={editGroup?.description || ""}
                          onChange={onChangeEditGroupProp}
                        />
                        <button onClick={() => submitEditGroup("description")}>
                          Submit Description Change
                        </button>
                      </label>
                      <label className={styles.changeGroupPhotoBtn}>
                        Change Photo
                        <input
                          type="file"
                          hidden
                          onChange={handlePhotoUpload}
                          accept="image/png, image/jpeg"
                        />
                      </label>
                      <button
                        className={styles.deleteGroupBtn}
                        onClick={(e) => handleDeleteGroup(e)}
                      >
                        Delete Group
                      </button>
                    </dialog>
                  </div>
                </div>
              ))}
          </section>
          <section className={styles.messages}>
            <button onClick={() => createGroupRef.current.showModal()}>
              Create a Group
            </button>
            <dialog ref={createGroupRef} className={styles.createGroupDialog}>
              <button onClick={closeCreateGroup}>Close</button>
              <label htmlFor="name">
                Name:{" "}
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="group name"
                  value={createGroup.name}
                  onChange={onChangeGroupProp}
                />
              </label>
              <label htmlFor="description">
                Description:{" "}
                <input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="group description"
                  value={createGroup.description}
                  onChange={onChangeGroupProp}
                />
              </label>
              <button onClick={submitGroup}>Submit</button>
            </dialog>
            {currentGroup ? (
              <>
                <div
                  className={styles.messagesHeader}
                  onClick={(e) => clearMessages(e)}
                >
                  <img
                    src={currentGroup.profilePhoto}
                    alt={currentGroup.name}
                  />
                  <span>
                    Messages with {currentGroup.name} (click to clear)
                  </span>
                </div>
                <div className={styles.messagesContainer}>
                  {groupMessages && groupMessages.length > 0
                    ? groupMessages
                        .filter((msg) => msg.toGroupId === currentGroup.id)
                        .map((msg) => (
                          <div
                            key={msg.keyID}
                            className={`${styles.message} ${
                              msg.authorId === account?.id
                                ? styles.userMessage
                                : styles.contactMessage
                            }`}
                          >
                            {msg.content ? (
                              <div className={styles.messageText}>
                                <div className={styles.authorInfo}>
                                  <img
                                    src={
                                      allProfiles.filter(
                                        (profile) =>
                                          profile.userId === msg.authorId,
                                      )[0]?.photo || "/default avatar.png"
                                    }
                                    alt="Author"
                                    className={styles.authorPhoto}
                                  />
                                  <span className={styles.authorName}>
                                    {allProfiles.filter(
                                      (profile) =>
                                        profile.userId === msg.authorId,
                                    )[0]?.displayName || "Unknown User"}
                                  </span>
                                </div>
                                <p>{msg.content}</p>
                                <span className={styles.messageTime}>
                                  {new Date(msg.createdAt).toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              msg.files.map((file) => (
                                <div
                                  key={file.keyID}
                                  className={styles.chatFile}
                                >
                                  <div className={styles.authorInfo}>
                                    <img
                                      src={
                                        allProfiles.filter(
                                          (profile) =>
                                            profile.userId === msg.authorId,
                                        )[0]?.photo || "/default avatar.png"
                                      }
                                      alt="Author"
                                      className={styles.authorPhoto}
                                    />
                                    <span className={styles.authorName}>
                                      {allProfiles.filter(
                                        (profile) =>
                                          profile.userId === msg.authorId,
                                      )[0]?.displayName || "Unknown User"}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    className={styles.downloadBtn}
                                    onClick={() => {
                                      downloadFileFromUrl(
                                        file.photo,
                                        file.originalName,
                                      );
                                    }}
                                  >
                                    {file.originalName} <Download />
                                  </button>
                                  <span className={styles.messageTime}>
                                    {new Date(msg.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        ))
                    : null}
                </div>
                <div className={styles.sendMessageSection}>
                  {messageType === "text" ? (
                    <>
                      <button onClick={() => setMessageType("image")}>
                        Send Images instead
                      </button>
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                      />
                      <button type="button" onClick={SendText}>
                        Send
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setMessageType("text")}>
                        Send Text instead
                      </button>
                      <p>Remeber that only jpg and png files are allowed.</p>
                      <p>A File must be less than 1MB.</p>
                      <p>No more than 5 files can be uploaded at onces.</p>
                      <label className={styles.uploadBtn}>
                        Send images
                        <input
                          type="file"
                          hidden
                          onChange={SendImages}
                          accept="image/png, image/jpeg"
                          multiple
                        />
                      </label>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <h1>Select a Group to view messages</h1>
                <img
                  src="/group conversation.svg"
                  alt="group conversation"
                  className={styles.conversationImage}
                />
              </>
            )}
          </section>
        </>
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

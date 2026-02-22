import styles from "./chats.module.css";
import { useState } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
import { UserMinus } from "lucide-react";
const apiUrl = import.meta.env.VITE_MESSAGING_APP_API_URL;
import { Download } from "lucide-react";

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
        `${apiUrl}/message/image/chat/toUser/${currentContact.id}`,
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
          toUserID: currentContact.id,
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
            {contacts.map((contact) => (
              <div
                key={contact.keyID}
                className={styles.contact}
                onClick={(e) => handleContactClick(e, contact)}
              >
                <img src={contact.photo} alt={contact.displayName} />
                <div>
                  <p>{contact.displayName}</p>
                  <button onClick={(e) => handleUnfollow(e, contact.id)}>
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
                  {contactMessages
                    .filter((msg) => msg.toUserId === currentContact.id)
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
                            <div key={file.keyID} className={styles.chatFile}>
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
                    ))}
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
  const { auth } = useContext(ItemContext);

  return (
    <div className={styles.chatBody}>
      {auth ? (
        <>
          <section className={styles.groups}></section>
          <section className={styles.messages}></section>
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

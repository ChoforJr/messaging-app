import styles from "./chats.module.css";
import { useMemo, useState, useRef } from "react";
import type { ChangeEvent, MouseEvent, SyntheticEvent } from "react";
import { useItemContext } from "../ItemContext";
import {
  ArrowLeft,
  Download,
  ImagePlus,
  MessageCircle,
  Plus,
  Pencil,
  Search,
  Send,
  Users,
  UserMinus,
} from "lucide-react";
import type { Contact, Group, Message } from "../types";
import { API_URL } from "../lib/config";

export const PeopleChats = () => {
  const {
    auth,
    account,
    contacts,
    refreshContacts,
    refreshExplorePeople,
    contactMessages,
    hasMoreContactMessages,
    loadOlderContactMessages,
    refreshRecentContactMessages,
  } = useItemContext();
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [messageType, setMessageType] = useState<"text" | "image">("text");
  const [messageText, setMessageText] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const authToken =
    typeof window === "undefined" ? null : window.localStorage.getItem("authorization");
  const latestMessageByContact = useMemo(() => {
    const latest = new Map<string, Message>();
    for (const message of contactMessages ?? []) {
      const contactId =
        message.authorId === account?.id ? message.toUserId : message.authorId;
      if (!contactId) continue;
      const current = latest.get(contactId);
      if (
        !current ||
        new Date(message.createdAt).getTime() > new Date(current.createdAt).getTime() ||
        (message.createdAt === current.createdAt &&
          Number(message.id) > Number(current.id))
      ) {
        latest.set(contactId, message);
      }
    }
    return latest;
  }, [account?.id, contactMessages]);

  const visibleContactMessages = useMemo(
    () =>
      (contactMessages ?? [])
        .filter(
          (message) =>
            currentContact &&
            (message.toUserId === currentContact.userId ||
              message.authorId === currentContact.userId),
        )
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
            Number(a.id) - Number(b.id),
        ),
    [contactMessages, currentContact],
  );

  const handleUnfollow = async (
    e: MouseEvent<HTMLButtonElement>,
    contactID: string,
  ) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/user/profile/disconnect`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken ?? "",
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

  function handleContactClick(
    e: MouseEvent<HTMLDivElement>,
    contact: Contact,
  ) {
    e.stopPropagation();
    setCurrentContact(contact);
    refreshRecentContactMessages();
  }
  function clearMessages(e: SyntheticEvent) {
    e.stopPropagation();
    setCurrentContact(null);
  }

  const SendImages = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!currentContact) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("uploads", files[i]);
    }
    try {
      const response = await fetch(
        `${API_URL}/message/image/chat/toUser/${currentContact.userId}`,
        {
          method: "POST",
          headers: { authorization: authToken ?? "" },
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
    if (!currentContact || !messageText.trim()) return;
    try {
      const response = await fetch(`${API_URL}/message/text/toUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken ?? "",
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

  async function downloadFileFromUrl(url: string, filename: string) {
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
            <div className={styles.contactsHeading}>
              <div>
                <span className={styles.eyebrow}>YOUR PEOPLE</span>
                <h2>Messages</h2>
                <p>{contacts?.length ?? 0} conversations</p>
              </div>
              <span className={styles.contactCount}>{contacts?.length ?? 0}</span>
            </div>
            <label className={styles.contactSearch}>
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={contactSearch}
                onChange={(event) => setContactSearch(event.target.value)}
                placeholder="Search people"
                aria-label="Search contacts"
              />
            </label>
            <div className={styles.contactList} role="list" aria-label="Your conversations">
              {contacts?.filter((contact) =>
                contact.displayName
                  .toLocaleLowerCase()
                  .includes(contactSearch.trim().toLocaleLowerCase()),
              ).map((contact) => {
                const latestMessage = latestMessageByContact.get(contact.userId);

                return (
                <div
                  key={contact.keyID}
                  className={`${styles.contact} ${currentContact?.userId === contact.userId ? styles.selectedContact : ""}`}
                  onClick={(e) => handleContactClick(e, contact)}
                  onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setCurrentContact(contact);
                        refreshRecentContactMessages();
                      }
                    }}
                    role="listitem"
                    tabIndex={0}
                    aria-current={currentContact?.userId === contact.userId}
                >
                  <span className={styles.contactAvatar}>
                    <img src={contact.photo} alt="" />
                  </span>
                  <span className={styles.contactInfo}>
                    <span className={styles.contactName}>{contact.displayName}</span>
                    <span className={styles.contactPreview}>
                      {latestMessage?.content || (latestMessage ? "Shared an image" : contact.bio)}
                    </span>
                  </span>
                  <span className={styles.contactMeta}>
                    {latestMessage && (
                      <time>
                        {new Date(latestMessage.createdAt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                    )}
                    <button
                      className={styles.unfollowButton}
                      aria-label={`Unfollow ${contact.displayName}`}
                      title={`Unfollow ${contact.displayName}`}
                      onClick={(e) => handleUnfollow(e, contact.userId)}
                    >
                      <UserMinus size={15} />
                    </button>
                  </span>
                </div>
                );
              })}
              {contacts?.length === 0 && (
                <div className={styles.contactEmpty}>
                  <MessageCircle size={22} />
                  <p>No conversations yet</p>
                  <span>Discover people to start a conversation.</span>
                </div>
              )}
              {contacts && contacts.length > 0 && !contacts.some((contact) =>
                contact.displayName.toLocaleLowerCase().includes(contactSearch.trim().toLocaleLowerCase()),
              ) && (
                <p className={styles.noSearchResults}>No people match “{contactSearch}”.</p>
              )}
            </div>
          </section>
          <section className={styles.messages}>
            {currentContact ? (
              <>
                <div className={styles.messagesHeader}>
                  <button
                    type="button"
                    className={styles.backToContacts}
                    onClick={clearMessages}
                    aria-label="Back to contacts"
                  >
                    <ArrowLeft size={19} />
                  </button>
                  <span className={styles.headerAvatar}>
                    <img src={currentContact.photo} alt="" />
                  </span>
                  <div className={styles.headerIdentity}>
                    <strong>{currentContact.displayName}</strong>
                    <span>Conversation</span>
                  </div>
                  <span className={styles.headerBadge}>
                    <span />
                    Direct message
                  </span>
                </div>
                <div className={styles.messagesContainer}>
                  {hasMoreContactMessages && (
                    <button
                      type="button"
                      className={styles.loadOlderButton}
                      disabled={isLoadingOlder || !contactMessages?.length}
                      onClick={async () => {
                        const oldest = contactMessages?.[0];
                        if (!oldest) return;
                        setIsLoadingOlder(true);
                        try {
                          await loadOlderContactMessages(oldest.createdAt, oldest.id);
                        } finally {
                          setIsLoadingOlder(false);
                        }
                      }}
                    >
                      {isLoadingOlder ? "Loading earlier messages…" : "Load earlier messages"}
                    </button>
                  )}
                  {visibleContactMessages.length > 0
                    ? visibleContactMessages.map((msg) => (
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
                      <div className={styles.composer}>
                        <button
                          type="button"
                          className={styles.attachButton}
                          onClick={() => setMessageType("image")}
                          aria-label="Attach images"
                          title="Attach images"
                        >
                          <ImagePlus size={19} />
                        </button>
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                              event.preventDefault();
                              void SendText();
                            }
                          }}
                          placeholder={`Message ${currentContact.displayName}...`}
                          aria-label="Write a message"
                          rows={1}
                        />
                        <button
                          type="button"
                          className={styles.sendButton}
                          onClick={() => void SendText()}
                          disabled={!messageText.trim()}
                          aria-label="Send message"
                        >
                          <Send size={17} />
                        </button>
                      </div>
                      <p className={styles.composerHint}>Press Enter to send · Shift + Enter for a new line</p>
                    </>
                  ) : (
                    <>
                      <div className={styles.imageComposer}>
                        <button
                          type="button"
                          className={styles.cancelAttach}
                          onClick={() => setMessageType("text")}
                        >
                          Back to message
                        </button>
                        <p>JPG or PNG · up to 5 images · 1 MB each</p>
                        <label className={styles.uploadBtn}>
                          <ImagePlus size={18} />
                          Choose images
                        <input
                          type="file"
                          hidden
                          onChange={SendImages}
                          accept="image/png, image/jpeg"
                          multiple
                        />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.emptyConversation}>
                <span><MessageCircle size={28} /></span>
                <h2>Your conversations, all in one place</h2>
                <p>Choose someone from your people list to pick up where you left off.</p>
              </div>
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
    memberGroups,
    refreshMemberGroups,
    refreshExploreGroups,
    groupMessages,
    hasMoreGroupMessages,
    loadOlderGroupMessages,
    refreshRecentGroupMessages,
  } =   useItemContext();
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [messageType, setMessageType] = useState<"text" | "image">("text");
  const [messageText, setMessageText] = useState("");
  const [createGroup, setCreateGroup] = useState({
    name: "",
    description: "",
  });
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);

  const createGroupRef = useRef<HTMLDialogElement>(null);
  const editGroupRef = useRef<HTMLDialogElement>(null);

  const authToken =
    typeof window === "undefined" ? null : window.localStorage.getItem("authorization");
  const visibleGroupMessages = useMemo(
    () => (groupMessages ?? []).filter((message) => message.toGroupId === currentGroup?.id),
    [currentGroup?.id, groupMessages],
  );

  const handleLeaveGroup = async (
    e: MouseEvent<HTMLButtonElement>,
    contactID: string,
  ) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/group/leave/${contactID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken ?? "",
        },
        body: JSON.stringify({ contactId: contactID }),
      });
      if (response.ok) {
        refreshMemberGroups();
        refreshExploreGroups();
        if (currentGroup?.id === contactID) setCurrentGroup(null);
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

  function handleGroupClick(e: MouseEvent<HTMLElement>, contact: Group) {
    e.stopPropagation();
    setCurrentGroup(contact);
    refreshRecentGroupMessages();
  }

  const SendImages = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!currentGroup) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("uploads", files[i]);
    }
    try {
      const response = await fetch(
        `${API_URL}/message/image/chat/toGroup/${currentGroup.id}`,
        {
          method: "POST",
          headers: { authorization: authToken ?? "" },
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
    if (!currentGroup) return;
    try {
      const response = await fetch(`${API_URL}/message/text/toGroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken ?? "",
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

  async function downloadFileFromUrl(url: string, filename: string) {
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

  function onChangeGroupProp(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "name" || name === "description") {
      setCreateGroup((prev) => ({ ...prev, [name]: value }));
    }
  }

  const submitGroup = async () => {
    const name = createGroup.name.trim();
    const description = createGroup.description.trim();
    if (!name || !description) {
      alert("Please fill in all fields");
      return;
    }
    setIsCreatingGroup(true);
    try {
      const response = await fetch(`${API_URL}/group/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken ?? "",
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        refreshMemberGroups();
        refreshExploreGroups();
        setCreateGroup({ name: "", description: "" });
        setCurrentGroup(null);
        createGroupRef.current?.close();
      } else {
        const err = await response.json();
        alert(err.error || "Server error: Message not sent");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Could not connect to the server. Please try again.");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  function closeCreateGroup() {
    setCreateGroup({ name: "", description: "" });
    createGroupRef.current?.close();
  }

  function handleEditGroup(e: MouseEvent<HTMLButtonElement>, group: Group) {
    e.stopPropagation();
    setEditGroup(group);
    editGroupRef.current?.showModal();
  }

  function closeEditGroup() {
    setEditGroup(null);
    editGroupRef.current?.close();
  }

  function onChangeEditGroupProp(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "name" || name === "description") {
      setEditGroup((prev) =>
        prev ? { ...prev, [name]: value } : prev,
      );
    }
  }

  const submitEditGroup = async (prop: "name" | "description") => {
    if (!editGroup) return;
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
    }

    try {
      const response = await fetch(`${API_URL}/group/${prop}/${editGroup.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: authToken ?? "",
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
    if (!editGroup) return;
    try {
      const response = await fetch(
        `${API_URL}/group/file/group/photo/${editGroup.profilePhotoId}`,
        {
          method: "DELETE",
          headers: { authorization: authToken ?? "" },
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

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!editGroup) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("uploads", file);

    if (editGroup.profilePhotoId) {
      await deletePhoto();
    }

    try {
      const response = await fetch(
        `${API_URL}/group/file/group/photo/${editGroup.id}`,
        {
          method: "POST",
          headers: { authorization: authToken ?? "" },
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

  const handleDeleteGroup = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!editGroup) return;
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This action is permanent and will delete all your data.",
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/group/delete/${editGroup.id}`, {
          method: "DELETE",
          headers: { authorization: authToken ?? "" },
        });

        if (response.ok) {
          alert("Group deleted successfully.");
          refreshMemberGroups();
          refreshExploreGroups();
          closeEditGroup();
          setCurrentGroup(null);
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
            <div className={styles.groupsHeading}>
              <div>
                <span className={styles.eyebrow}>YOUR COMMUNITIES</span>
                <h2>Group chats</h2>
                <p>{memberGroups?.length ?? 0} groups</p>
              </div>
              <button
                type="button"
                className={styles.createGroupButton}
                onClick={() => createGroupRef.current?.showModal()}
              >
                <Plus size={17} />
                <span>Create</span>
              </button>
            </div>
            <div className={styles.groupList}>
              {memberGroups?.map((group) => (
                <article
                  key={group.keyID}
                  className={`${styles.groupRow} ${currentGroup?.id === group.id ? styles.selectedGroup : ""}`}
                >
                  <button
                    type="button"
                    className={styles.groupSelect}
                    onClick={(event) => handleGroupClick(event, group)}
                    aria-current={currentGroup?.id === group.id}
                  >
                    <img src={group.profilePhoto} alt="" />
                    <span>
                      <strong>{group.name}</strong>
                      <small>{group.description}</small>
                    </span>
                  </button>
                  <div className={styles.groupActions}>
                    {account?.profileId === group.adminId && (
                      <button
                        type="button"
                        className={styles.editGroupBtn}
                        onClick={(event) => handleEditGroup(event, group)}
                        aria-label={`Edit ${group.name}`}
                        title="Edit group"
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.leaveGroupButton}
                      onClick={(event) => handleLeaveGroup(event, group.id)}
                      aria-label={`Leave ${group.name}`}
                      title="Leave group"
                    >
                      <UserMinus size={15} />
                    </button>
                  </div>
                </article>
              ))}
              {memberGroups?.length === 0 && (
                <div className={styles.groupListEmpty}>
                  <Users size={21} />
                  <p>No group chats yet</p>
                  <span>Create a group or discover one to get started.</span>
                </div>
              )}
            </div>
            <dialog ref={editGroupRef} className={styles.editGroupDialog}>
              <button type="button" onClick={closeEditGroup}>Close</button>
              <label htmlFor="nameChange">
                Change Name
                <input
                  type="text"
                  name="name"
                  id="nameChange"
                  placeholder="Group name"
                  value={editGroup?.name || ""}
                  onChange={onChangeEditGroupProp}
                />
                <button type="button" onClick={() => submitEditGroup("name")}>
                  Save name
                </button>
              </label>
              <label htmlFor="descriptionChange">
                Change Description
                <input
                  type="text"
                  name="description"
                  id="descriptionChange"
                  placeholder="Group description"
                  value={editGroup?.description || ""}
                  onChange={onChangeEditGroupProp}
                />
                <button
                  type="button"
                  onClick={() => submitEditGroup("description")}
                >
                  Save description
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
                type="button"
                className={styles.deleteGroupBtn}
                onClick={(event) => handleDeleteGroup(event)}
              >
                Delete Group
              </button>
            </dialog>
          </section>
          <section className={styles.messages}>
            <dialog ref={createGroupRef} className={styles.createGroupDialog}>
              <div className={styles.createDialogHeader}>
                <span className={styles.createDialogIcon}><Users size={20} /></span>
                <div>
                  <h2>Create a group</h2>
                  <p>Start a space for your people.</p>
                </div>
                <button
                  type="button"
                  className={styles.closeDialogButton}
                  onClick={closeCreateGroup}
                  aria-label="Close create group dialog"
                >
                  ×
                </button>
              </div>
              <label htmlFor="groupName">
                Group name
                <input
                  type="text"
                  name="name"
                  id="groupName"
                  placeholder="e.g. Weekend plans"
                  value={createGroup.name}
                  onChange={onChangeGroupProp}
                  maxLength={80}
                  required
                />
              </label>
              <label htmlFor="groupDescription">
                Description
                <input
                  type="text"
                  name="description"
                  id="groupDescription"
                  placeholder="What will this group be about?"
                  value={createGroup.description}
                  onChange={onChangeGroupProp}
                  maxLength={240}
                  required
                />
              </label>
              <button
                type="button"
                className={styles.submitCreateGroup}
                onClick={() => void submitGroup()}
                disabled={isCreatingGroup}
              >
                {isCreatingGroup ? "Creating group…" : "Create group"}
              </button>
            </dialog>
            {currentGroup ? (
              <>
                <div className={styles.messagesHeader}>
                  <img
                    src={currentGroup.profilePhoto}
                    alt={currentGroup.name}
                  />
                  <div className={styles.headerIdentity}>
                    <strong>{currentGroup.name}</strong>
                    <span>{currentGroup.description || "Group conversation"}</span>
                  </div>
                  <span className={styles.headerBadge}>
                    <span />
                    Group chat
                  </span>
                </div>
                <div className={styles.messagesContainer}>
                  {hasMoreGroupMessages && (
                    <button
                      type="button"
                      className={styles.loadOlderButton}
                      disabled={isLoadingOlder || !groupMessages?.length}
                      onClick={async () => {
                        const oldest = groupMessages?.[0];
                        if (!oldest) return;
                        setIsLoadingOlder(true);
                        try {
                          await loadOlderGroupMessages(oldest.createdAt, oldest.id);
                        } finally {
                          setIsLoadingOlder(false);
                        }
                      }}
                    >
                      {isLoadingOlder ? "Loading earlier messages…" : "Load earlier messages"}
                    </button>
                  )}
                  {visibleGroupMessages.length > 0
                    ? visibleGroupMessages.map((msg) => (
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
                                    src={msg.authorPhoto || "/default avatar.png"}
                                    alt="Author"
                                    className={styles.authorPhoto}
                                  />
                                  <span className={styles.authorName}>
                                    {msg.authorName || "Unknown User"}
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
                                      src={msg.authorPhoto || "/default avatar.png"}
                                      alt="Author"
                                      className={styles.authorPhoto}
                                    />
                                    <span className={styles.authorName}>
                                      {msg.authorName || "Unknown User"}
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
              <div className={styles.emptyConversation}>
                <span><Users size={28} /></span>
                <h2>Your group chats start here</h2>
                <p>Bring your people together in a space for the things you share.</p>
                <button
                  type="button"
                  className={styles.emptyCreateGroupButton}
                  onClick={() => createGroupRef.current?.showModal()}
                >
                  <Plus size={17} />
                  Create a group
                </button>
              </div>
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

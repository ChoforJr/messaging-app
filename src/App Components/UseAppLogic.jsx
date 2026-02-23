import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_MESSAGING_APP_API_URL;

export function useAppLogic() {
  const [auth, setAuth] = useState(false);
  const [account, setAccount] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [memberGroups, setMemberGroups] = useState(null);
  const [explorePeople, setExplorePeople] = useState(null);
  const [exploreGroups, setExploreGroups] = useState(null);
  const [allProfiles, setAllProfiles] = useState(null);
  const [contactMessages, setContactMessages] = useState(null);
  const [groupMessages, setGroupMessages] = useState(null);

  const getAccountInfo = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/user/self`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        let profilePhoto = result.profile.photo?.url || "/default avatar.png";
        if (
          result.profile.type === "guest" &&
          result.username === "goku@gmail.com"
        ) {
          profilePhoto = "/goku.jpeg";
        } else if (
          result.profile.type === "guest" &&
          result.username === "vegeta@gmail.com"
        ) {
          profilePhoto = "/vegeta.jpg";
        }

        setAccount({
          id: result.id,
          profileId: result.profile.id,
          keyID: crypto.randomUUID(),
          username: result.username,
          createdAt: result.createdAt,
          displayName: result.profile.displayName,
          bio: result.profile.bio || "No Bio Available",
          photo: profilePhoto,
          photoId: result.profile.photo?.id,
        });
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getContacts = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/user/profile/followings`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.following.map((item) => {
          let profilePhoto = item.photo?.url || "/default avatar.png";
          if (item.type === "guest" && item.displayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (item.type === "guest" && item.displayName === "Vegeta") {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            userId: item.userId,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            displayName: item.displayName,
            bio: item.bio || "No Bio Available",
            photo: profilePhoto,
            photoId: item.photo?.id,
          };
        });
        setContacts(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getExplorePeople = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/user/profile/explore`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.map((item) => {
          let profilePhoto = item.photo?.url || "/default avatar.png";
          if (item.type === "guest" && item.displayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (item.type === "guest" && item.displayName === "Vegeta") {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            userId: item.userId,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            displayName: item.displayName,
            bio: item.bio || "No Bio Available",
            photo: profilePhoto,
            photoId: item.photo?.id,
          };
        });
        setExplorePeople(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getMemberGroups = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/group/memberOf`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            name: item.name,
            description: item.description || "No Description Available",
            adminId: item.adminId,
            profilePhoto: item.profilePhoto?.url || "/default avatar.png",
            profilePhotoId: item.profilePhoto?.id,
          };
        });
        setMemberGroups(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getExploreGroups = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/group/explore`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            name: item.name,
            description: item.description || "No Description Available",
            adminId: item.adminId,
            profilePhoto: item.profilePhoto?.url || "/default avatar.png",
            profilePhotoId: item.profilePhoto?.id,
          };
        });
        setExploreGroups(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getAllProfiles = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/user/profile/all`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.map((item) => {
          let profilePhoto = item.photo?.url || "/default avatar.png";
          if (item.type === "guest" && item.displayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (item.type === "guest" && item.displayName === "Vegeta") {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            userId: item.userId,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            displayName: item.displayName,
            bio: item.bio || "No Bio Available",
            photo: profilePhoto,
            photoId: item.photo?.id,
          };
        });
        setAllProfiles(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getContactMessages = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/message/all`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            content: item.content,
            toUserId: item.toUserId,
            authorId: item.authorId,
            files: item.Files.map((file) => {
              return {
                keyID: crypto.randomUUID(),
                originalName: file.originalName,
                size: file.size,
                photo: file.url,
                photoId: file.id,
              };
            }),
          };
        });
        setContactMessages(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getGroupMessages = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/message/all/groups`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            content: item.content,
            toGroupId: item.toGroupId,
            authorId: item.authorId,
            files: item.Files.map((file) => {
              return {
                keyID: crypto.randomUUID(),
                originalName: file.originalName,
                size: file.size,
                photo: file.url,
                photoId: file.id,
              };
            }),
          };
        });
        setGroupMessages(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  function addContactMessages(newMessages) {
    setContactMessages((prevMessages) => {
      return [...prevMessages, newMessages];
    });
  }

  async function getRecentContactMessages(authToken) {
    if (!contactMessages || contactMessages.length === 0) {
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/message/recent`, {
        method: "POST",
        headers: {
          authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recentDate: contactMessages?.[contactMessages.length - 1]?.createdAt,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        result.forEach((item) => {
          addContactMessages({
            id: item.id,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            content: item.content,
            toUserId: item.toUserId,
            authorId: item.authorId,
            files: item.Files.map((file) => ({
              keyID: crypto.randomUUID(),
              originalName: file.originalName,
              size: file.size,
              photo: file.url,
              photoId: file.id,
            })),
          });
        });
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  function addGroupMessages(newMessages) {
    setGroupMessages((prevMessages) => {
      return [...prevMessages, newMessages];
    });
  }

  async function getRecentGroupMessages(authToken) {
    if (!groupMessages || groupMessages.length === 0) {
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/message/recent/groups`, {
        method: "POST",
        headers: {
          authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recentDate: groupMessages?.[groupMessages.length - 1]?.createdAt,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        result.forEach((item) => {
          addGroupMessages({
            id: item.id,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            content: item.content,
            toGroupId: item.toGroupId,
            authorId: item.authorId,
            files: item.Files.map((file) => ({
              keyID: crypto.randomUUID(),
              originalName: file.originalName,
              size: file.size,
              photo: file.url,
              photoId: file.id,
            })),
          });
        });
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem("authorization");
    if (authToken) {
      getAccountInfo(authToken);
      getContacts(authToken);
      getExplorePeople(authToken);
      getMemberGroups(authToken);
      getExploreGroups(authToken);
      getAllProfiles(authToken);
      getContactMessages(authToken);
      getGroupMessages(authToken);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authorization");
    setAuth(false);
    setAccount(null);
    setContacts(null);
    setMemberGroups(null);
    setExplorePeople(null);
    setExploreGroups(null);
    setAllProfiles(null);
    setContactMessages(null);
    setGroupMessages(null);
    navigate("/", { replace: false });
  };

  return {
    auth,
    setAuth,
    account,
    refreshAccount: () => getAccountInfo(localStorage.getItem("authorization")),
    contacts,
    refreshContacts: () => getContacts(localStorage.getItem("authorization")),
    explorePeople,
    refreshExplorePeople: () =>
      getExplorePeople(localStorage.getItem("authorization")),
    memberGroups,
    refreshMemberGroups: () =>
      getMemberGroups(localStorage.getItem("authorization")),
    exploreGroups,
    refreshExploreGroups: () =>
      getExploreGroups(localStorage.getItem("authorization")),
    allProfiles,
    refreshAllProfiles: () =>
      getAllProfiles(localStorage.getItem("authorization")),
    contactMessages,
    groupMessages,
    logout,
    refreshRecentContactMessages: () =>
      getRecentContactMessages(localStorage.getItem("authorization")),
    refreshRecentGroupMessages: () =>
      getRecentGroupMessages(localStorage.getItem("authorization")),
  };
}

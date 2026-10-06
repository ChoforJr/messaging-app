import { useState, useEffect } from "react";
import { API_URL } from "../lib/config";
import type {
  Account,
  ApiAccountResponse,
  ApiGroup,
  ApiMessage,
  ApiProfile,
  Contact,
  Group,
  Message,
  Profile,
} from "../types";

export function useAppLogic() {
  const [auth, setAuth] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [memberGroups, setMemberGroups] = useState<Group[] | null>(null);
  const [explorePeople, setExplorePeople] = useState<Profile[] | null>(null);
  const [exploreGroups, setExploreGroups] = useState<Group[] | null>(null);
  const [contactMessages, setContactMessages] = useState<Message[] | null>(
    null,
  );
  const [groupMessages, setGroupMessages] = useState<Message[] | null>(null);
  const [hasMoreContactMessages, setHasMoreContactMessages] = useState(false);
  const [hasMoreGroupMessages, setHasMoreGroupMessages] = useState(false);

  const getAccountInfo = async (authToken: string | null) => {
    try {
      const response = await fetch(`${API_URL}/user/self`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = (await response.json()) as ApiAccountResponse;
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

  const getContacts = async (authToken: string | null) => {
    try {
      const response = await fetch(`${API_URL}/user/profile/followings`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = (await response.json()) as { following: ApiProfile[] };
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

  const getExplorePeople = async (authToken: string | null) => {
    try {
      const response = await fetch(`${API_URL}/user/profile/explore`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = (await response.json()) as ApiProfile[];
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

  const getMemberGroups = async (authToken: string | null) => {
    try {
      const response = await fetch(`${API_URL}/group/memberOf`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = (await response.json()) as ApiGroup[];
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

  const getExploreGroups = async (authToken: string | null) => {
    try {
      const response = await fetch(`${API_URL}/group/explore`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = (await response.json()) as ApiGroup[];
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

  const getContactMessages = async (
    authToken: string | null,
    before?: string,
    beforeId?: string,
  ) => {
    try {
      const query = before
        ? `?before=${encodeURIComponent(before)}&beforeId=${encodeURIComponent(beforeId ?? "")}`
        : "";
      const response = await fetch(`${API_URL}/message/all${query}`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = (await response.json()) as ApiMessage[];
        const neededItems = result.reverse().map((item) => {
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
        setHasMoreContactMessages(neededItems.length === 100);
        setContactMessages((previous) =>
          before
            ? mergeMessages(neededItems, previous ?? [])
            : neededItems,
        );
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getGroupMessages = async (
    authToken: string | null,
    before?: string,
    beforeId?: string,
  ) => {
    try {
      const query = before
        ? `?before=${encodeURIComponent(before)}&beforeId=${encodeURIComponent(beforeId ?? "")}`
        : "";
      const response = await fetch(`${API_URL}/message/all/groups${query}`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = (await response.json()) as ApiMessage[];
        const neededItems = result.reverse().map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            content: item.content,
            toGroupId: item.toGroupId,
            authorId: item.authorId,
            authorName: item.author?.profile?.displayName || "Unknown User",
            authorPhoto:
              item.author?.profile?.photo?.url || "/default avatar.png",
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
        setHasMoreGroupMessages(neededItems.length === 100);
        setGroupMessages((previous) =>
          before
            ? mergeMessages(neededItems, previous ?? [])
            : neededItems,
        );
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  async function getRecentContactMessages(authToken: string | null) {
    try {
      const response = await fetch(`${API_URL}/message/recent`, {
        method: "POST",
        headers: {
          authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recentDate:
            contactMessages?.at(-1)?.createdAt ??
            new Date(Date.now() - 60_000).toISOString(),
        }),
      });
      if (response.ok) {
        const result = (await response.json()) as ApiMessage[];
        const neededItems = result.reverse().map((item) => ({
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
          }));
        setContactMessages((previous) =>
          mergeMessages(previous ?? [], neededItems),
        );
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  async function getRecentGroupMessages(authToken: string | null) {
    try {
      const response = await fetch(`${API_URL}/message/recent/groups`, {
        method: "POST",
        headers: {
          authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recentDate:
            groupMessages?.at(-1)?.createdAt ??
            new Date(Date.now() - 60_000).toISOString(),
        }),
      });
      if (response.ok) {
        const result = (await response.json()) as ApiMessage[];
        const neededItems = result.reverse().map((item) => ({
            id: item.id,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            content: item.content,
            toGroupId: item.toGroupId,
            authorId: item.authorId,
            authorName: item.author?.profile?.displayName || "Unknown User",
            authorPhoto:
              item.author?.profile?.photo?.url || "/default avatar.png",
            files: item.Files.map((file) => ({
              keyID: crypto.randomUUID(),
              originalName: file.originalName,
              size: file.size,
              photo: file.url,
              photoId: file.id,
            })),
          }));
        setGroupMessages((previous) =>
          mergeMessages(previous ?? [], neededItems),
        );
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  useEffect(() => {
    const authToken = localStorage.getItem("authorization");
    if (authToken) {
      getAccountInfo(authToken);
      getContacts(authToken);
      getExplorePeople(authToken);
      getMemberGroups(authToken);
      getExploreGroups(authToken);
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
    setContactMessages(null);
    setGroupMessages(null);
    setHasMoreContactMessages(false);
    setHasMoreGroupMessages(false);
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
    contactMessages,
    groupMessages,
    hasMoreContactMessages,
    hasMoreGroupMessages,
    logout,
    refreshContactMessages: () =>
      getContactMessages(localStorage.getItem("authorization")),
    refreshGroupMessages: () =>
      getGroupMessages(localStorage.getItem("authorization")),
    refreshRecentContactMessages: () =>
      getRecentContactMessages(localStorage.getItem("authorization")),
    refreshRecentGroupMessages: () =>
      getRecentGroupMessages(localStorage.getItem("authorization")),
    loadOlderContactMessages: (before: string, beforeId: string) =>
      getContactMessages(localStorage.getItem("authorization"), before, beforeId),
    loadOlderGroupMessages: (before: string, beforeId: string) =>
      getGroupMessages(localStorage.getItem("authorization"), before, beforeId),
  };
}

function mergeMessages(existing: Message[], incoming: Message[]): Message[] {
  const messages = new Map(existing.map((message) => [message.id, message]));
  for (const message of incoming) messages.set(message.id, message);
  return [...messages.values()].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
      Number(a.id) - Number(b.id),
  );
}

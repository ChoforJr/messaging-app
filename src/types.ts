import type { Dispatch, SetStateAction } from "react";

export interface Account {
  id: string;
  profileId: string;
  keyID: string;
  username: string;
  createdAt: string;
  displayName: string;
  bio: string;
  photo: string;
  photoId?: string;
}

export interface Contact {
  id: string;
  userId: string;
  keyID: string;
  createdAt: string;
  displayName: string;
  bio: string;
  photo: string;
  photoId?: string;
}

export interface Group {
  id: string;
  keyID: string;
  createdAt: string;
  name: string;
  description: string;
  adminId: string;
  profilePhoto: string;
  profilePhotoId?: string;
}

export type Profile = Contact;

export interface ApiPhoto {
  id: string;
  url: string;
}

export interface ApiProfile {
  id: string;
  userId: string;
  createdAt: string;
  displayName: string;
  bio?: string | null;
  type?: string;
  photo?: ApiPhoto | null;
}

export interface ApiGroup {
  id: string;
  createdAt: string;
  name: string;
  description?: string | null;
  adminId: string;
  profilePhoto?: ApiPhoto | null;
}

export interface ApiFile {
  id: string;
  url: string;
  originalName: string;
  size: number;
}

export interface ApiMessage {
  id: string;
  createdAt: string;
  content: string | null;
  toUserId?: string;
  toGroupId?: string;
  authorId: string;
  author?: {
    profile?: {
      displayName: string;
      photo?: { url: string } | null;
    } | null;
  };
  Files: ApiFile[];
}

export interface ApiAccountResponse {
  id: string;
  username: string;
  createdAt: string;
  profile: {
    id: string;
    type?: string;
    displayName: string;
    bio?: string | null;
    photo?: ApiPhoto | null;
  };
}

export interface ApiValidationError {
  msg: string;
}

export interface ApiErrorResponse {
  errors?: ApiValidationError[];
  error?: string;
  message?: string;
}

export interface ApiLoginResponse extends ApiErrorResponse {
  token: string;
}

export interface MessageFile {
  keyID: string;
  originalName: string;
  size: number;
  photo: string;
  photoId: string;
}

export interface Message {
  id: string;
  keyID: string;
  createdAt: string;
  content: string | null;
  toUserId?: string;
  toGroupId?: string;
  authorId: string;
  authorName?: string;
  authorPhoto?: string;
  files: MessageFile[];
}

export interface ItemContextValue {
  auth: boolean;
  setAuth: Dispatch<SetStateAction<boolean>>;
  account: Account | null;
  refreshAccount: () => void;
  contacts: Contact[] | null;
  refreshContacts: () => void;
  explorePeople: Profile[] | null;
  refreshExplorePeople: () => void;
  memberGroups: Group[] | null;
  refreshMemberGroups: () => void;
  exploreGroups: Group[] | null;
  refreshExploreGroups: () => void;
  contactMessages: Message[] | null;
  groupMessages: Message[] | null;
  hasMoreContactMessages: boolean;
  hasMoreGroupMessages: boolean;
  logout: () => void;
  refreshContactMessages: () => void;
  refreshGroupMessages: () => void;
  refreshRecentContactMessages: () => void;
  refreshRecentGroupMessages: () => void;
  loadOlderContactMessages: (before: string, beforeId: string) => Promise<void>;
  loadOlderGroupMessages: (before: string, beforeId: string) => Promise<void>;
}

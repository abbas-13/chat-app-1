import type { Dispatch, SetStateAction } from "react";

export interface TUser {
  _id: string;
  email: string;
  name: string;
  displayName: string;
}

export interface TUserContext {
  user: TUser;
  setUser: Dispatch<SetStateAction<TUser>>;
}

export interface TConversation {
  createdAt: string;
  lastMessage: {
    createdAt: string;
    senderId: string;
    text: string;
  };
  participants: {
    displayName: string;
    email: string;
    name: string;
    _id: string;
  }[];
  updatedAt: string;
  _id: string;
}

export interface TSelectedConversation {
  recipientId: string;
  recipientName: string;
}

export interface TSelectedConversationContext {
  selectedConversation: TSelectedConversation;
  setSelectedConversation: Dispatch<SetStateAction<TSelectedConversation>>;
}

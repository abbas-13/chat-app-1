import type { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";

export interface TUser {
  _id: string;
  email: string;
  name: string;
  displayName: string;
  displayPicture: string;
}

export interface TMessage {
  _id: string;
  text: string;
  senderId: {
    _id: string;
    email: string;
    name: string;
    displayName: string;
  };
  readBy: [];
  conversationId: string;
  createdAt: string;
}

export interface ServerToClientEvents {
  getOnlineUsers: (userIds: string[]) => void;
  newMessage: (message: TMessage) => void;
  conversationUpdated: (conversation: TConversation) => void;
}

export interface TUserContext {
  user: TUser;
  setUser: Dispatch<SetStateAction<TUser>>;
  onlineUsers: string[];
  socket: Socket<ServerToClientEvents> | undefined;
  disconnectSocket: () => void;
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
  messages: TMessage[];
  setMessages: Dispatch<SetStateAction<TMessage[]>>;
  subscribeToMessage: (recipientId: string, socket: Socket) => void;
  unsubscribeFromMessages: (socket: Socket) => void;
}

import type { TSelectedConversationContext } from "@/assets/types";
import { createContext } from "react";

export const ConversationContext = createContext<TSelectedConversationContext>({
  selectedConversation: {
    recipientId: "",
    recipientName: "",
  },
  setSelectedConversation: () => {},
});

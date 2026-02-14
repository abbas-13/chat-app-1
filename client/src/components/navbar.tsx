import { useContext } from "react";
import { Info } from "lucide-react";

import { ConversationContext } from "@/context/conversationContext";
import { AuthContext } from "@/context/authContext";

export const Navbar = () => {
  const { selectedConversation } = useContext(ConversationContext);
  const { onlineUsers } = useContext(AuthContext);

  return (
    <div className="w-full h-[58px] border-b-2 border-b-white bg-secondary grid grid-cols-[1fr_1fr] items-center px-2">
      <div className="justify-self-end flex flex-col">
        <h3 className="text-[20px] font-medium tracking-tight">
          {selectedConversation.recipientName}{" "}
        </h3>
        <span className="text-xs">
          {onlineUsers.length > 0 &&
            onlineUsers.includes(selectedConversation.recipientId) &&
            "online"}
        </span>
      </div>
      <div className="justify-self-end hover:bg-[#e6e6ff] p-1 flex justify-center items-center rounded-full">
        <Info size={24} />
      </div>
    </div>
  );
};

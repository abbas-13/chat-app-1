import { ConversationContext } from "@/context/conversationContext";
import { Info } from "lucide-react";
import { useContext } from "react";

export const Navbar = () => {
  const { selectedConversation } = useContext(ConversationContext);
  return (
    <div className="w-full h-[54px] border-b-2 border-b-white bg-secondary grid grid-cols-[1fr_1fr] items-center px-2">
      <h3 className="scroll-m-20 text-[22px] font-medium tracking-tight justify-self-end">
        {selectedConversation.recipientName}
      </h3>
      <div className="justify-self-end hover:bg-[#e6e6ff] p-1 flex justify-center items-center rounded-full">
        <Info size={24} />
      </div>
    </div>
  );
};

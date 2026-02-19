import { useContext } from "react";
import { Info } from "lucide-react";

import { ConversationContext } from "@/context/conversationContext";
import { AuthContext } from "@/context/authContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export const Navbar = () => {
  const { selectedConversation } = useContext(ConversationContext);
  const { onlineUsers } = useContext(AuthContext);

  return (
    <div className="w-full h-[58px] border-b-2 border-b-white bg-secondary grid grid-cols-[1fr_1fr] items-center px-2">
      <div className="justify-self-end flex flex-col">
        <h3 className="text-[20px] font-medium tracking-tight">
          {selectedConversation.recipientDisplayName ??
            selectedConversation.recipientName}
        </h3>
        <span className="text-xs">
          {onlineUsers.length > 0 &&
            onlineUsers.includes(selectedConversation.recipientId) &&
            "online"}
        </span>
      </div>
      <div className="justify-self-end hover:bg-[#e6e6ff] p-1 flex justify-center items-center rounded-full">
        {selectedConversation.recipientId.length > 0 && (
          <Dialog>
            <DialogTrigger>
              <Info size={24} />
            </DialogTrigger>
            <DialogContent className="w-[400px] ">
              <DialogHeader>
                <DialogTitle>{selectedConversation.recipientName}</DialogTitle>
              </DialogHeader>
              <div className="border border-gray-300 w-full justify-self-center"></div>
              <div className="flex justify-center w-full flex-col">
                <div className="p-2 flex items-center gap-4">
                  <div className="flex w-full justify-center gap-2">
                    <div className="w-[100px] relative">
                      <img
                        className="w-[100px] rounded-full"
                        src={selectedConversation.recipientDisplayPicture}
                      />
                      <span
                        data-slot="avatar-badge"
                        className={`${
                          onlineUsers.length > 0 &&
                          onlineUsers.includes(selectedConversation.recipientId)
                            ? "bg-green-600 dark:bg-green-800"
                            : "bg-gray-400"
                        } ring-background h-4 w-4 absolute right-2 bottom-2 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none`}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center flex-col gap-3">
                  <div className="grid grid-cols-[35%_65%] w-full justify-between  items-center">
                    <label className="text-normal text-[14px] font-semibold">
                      Display Name:
                    </label>
                    <label className="border-b-1! border-b-gray-400! text-sm border-background py-2">
                      {selectedConversation.recipientDisplayName}
                    </label>
                  </div>
                  <div className="grid grid-cols-[35%_65%] w-full justify-between items-center">
                    <label className="text-normal text-[14px] font-semibold">
                      Status:
                    </label>
                    <label className="border-b-1! border-b-gray-400! text-sm border-background py-2">
                      {selectedConversation.recipientStatus}
                    </label>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

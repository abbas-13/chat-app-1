import { useContext } from "react";
import { ArrowLeft, Info } from "lucide-react";

import { ConversationContext } from "@/context/conversationContext";
import { AuthContext } from "@/context/authContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router";

export const Navbar = () => {
  const { selectedConversation } = useContext(ConversationContext);
  const { onlineUsers } = useContext(AuthContext);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="w-full h-[58px] border-b border-border bg-card flex justify-between items-center px-3">
      <div>
        {isMobile && (
          <ArrowLeft
            className="cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/conversations")}
          />
        )}
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-[15px] font-semibold leading-tight tracking-tight text-foreground">
          {selectedConversation.recipientDisplayName ||
            selectedConversation.recipientName}
        </h3>
        <span className="text-[11px] text-muted-foreground">
          {onlineUsers.length > 0 &&
            onlineUsers.includes(selectedConversation.recipientId) &&
            "online"}
        </span>
      </div>
      <div className="justify-self-end hover:bg-accent p-1.5 flex justify-center items-center rounded-lg transition-colors">
        {selectedConversation.recipientId.length > 0 && (
          <Dialog>
            <DialogTrigger>
              <Info size={20} className="text-muted-foreground" />
            </DialogTrigger>
            <DialogContent className="w-[400px]">
              <DialogHeader>
                <DialogTitle>{selectedConversation.recipientName}</DialogTitle>
              </DialogHeader>
              <div className="border-t border-border w-full"></div>
              <div className="flex justify-center w-full flex-col">
                <div className="p-2 flex items-center gap-4">
                  <div className="flex w-full justify-center gap-2">
                    <div className="relative">
                      <Avatar className="h-[100px] w-[100px]">
                        <AvatarImage
                          src={
                            selectedConversation.recipientDisplayPicture ||
                            undefined
                          }
                          alt={
                            selectedConversation.recipientDisplayName ||
                            selectedConversation.recipientName ||
                            "User"
                          }
                        />
                        <AvatarFallback className="text-3xl">
                          {(
                            selectedConversation.recipientDisplayName ||
                            selectedConversation.recipientName ||
                            "?"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
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
                    <label className="text-[13px] font-semibold text-muted-foreground">
                      Display Name:
                    </label>
                    <label className="border-b border-border py-2 text-sm text-foreground">
                      {selectedConversation.recipientDisplayName}
                    </label>
                  </div>
                  <div className="grid grid-cols-[35%_65%] w-full justify-between items-center">
                    <label className="text-[13px] font-semibold text-muted-foreground">
                      Status:
                    </label>
                    <label className="border-b border-border py-2 text-sm text-foreground">
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

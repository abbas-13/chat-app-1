import { useContext, type Dispatch, type SetStateAction } from "react";

import { Input } from "./ui/input";
import { AuthContext } from "@/context/authContext";
import { ConversationContext } from "@/context/conversationContext";
import { formatConvoDate } from "@/lib/utils";
import type { TConversation, TUser } from "@/assets/types";
import { SidebarProfileMenu } from "./sidebarProfileMenu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router";

interface TCustomSidebarContent {
  debouncedSearch: (query: string) => void;
  currConversations: TConversation[];
  searchedUsers: TUser[];
  setSearchedUsers: Dispatch<SetStateAction<TUser[]>>;
  setIsProfileDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const CustomSidebarContent = ({
  debouncedSearch,
  currConversations,
  searchedUsers,
  setSearchedUsers,
  setIsProfileDialogOpen,
}: TCustomSidebarContent) => {
  const { user } = useContext(AuthContext);
  const { setSelectedConversation } = useContext(ConversationContext);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col text-left">
      <div className="flex gap-2 h-[58px] justify-center w-full items-center">
        <img style={{ height: "28px" }} src="/social-ly-logo.svg" />
        <h1 className="text-[26px] font-extrabold leading-none tracking-tight text-foreground">
          social.ly
        </h1>
      </div>
      <div className="flex flex-col justify-between h-[calc(100%-58px)] px-2 pb-2">
        <div className="flex flex-col gap-1 overflow-y-auto">
          <Input
            onChange={(event) => debouncedSearch(event.target.value)}
            placeholder="Search in chats"
            className="mb-1 rounded-lg border-border bg-background shadow-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {searchedUsers.length > 0
            ? searchedUsers?.map((item: TUser) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setSelectedConversation({
                      recipientId: item._id,
                      recipientName: item.name || item.displayName,
                      recipientDisplayPicture: item.displayPicture,
                      recipientStatus: item.status,
                      recipientDisplayName: item.displayName,
                      _id: "",
                    });
                    setSearchedUsers([]);
                    if (isMobile) {
                      navigate("/");
                    }
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-accent"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage
                      src={item.displayPicture || undefined}
                      alt={item.displayName || item.name || "User"}
                    />
                    <AvatarFallback>
                      {(item.displayName || item.name || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="truncate text-sm font-semibold text-foreground">
                    {item.displayName || item.name}
                  </h4>
                </div>
              ))
            : currConversations?.map((item: TConversation) => {
                const recipient = item.participants.filter(
                  (participant) => participant._id !== user._id,
                )[0];

                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSelectedConversation({
                        recipientId: recipient._id,
                        recipientName: recipient.name || recipient.displayName,
                        recipientDisplayPicture: recipient.displayPicture,
                        recipientStatus: recipient.status,
                        recipientDisplayName: recipient.displayName,
                        _id: item._id,
                      });
                      if (isMobile) {
                        navigate("/");
                      }
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-accent"
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage
                        src={recipient.displayPicture || undefined}
                        alt={recipient.displayName || recipient.name || "User"}
                      />
                      <AvatarFallback>
                        {(recipient.displayName || recipient.name || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="truncate text-sm font-semibold text-foreground">
                          {recipient.displayName || recipient.name}
                        </h4>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {formatConvoDate(item.updatedAt)}
                        </span>
                      </div>
                      <span className="block truncate text-xs text-muted-foreground">
                        {String(item.lastMessage.senderId) === user._id
                          ? "You: "
                          : ""}
                        {item.lastMessage.text}
                      </span>
                    </div>
                  </div>
                );
              })}
        </div>
        <div className="border-t border-border pt-2">
          <SidebarProfileMenu setIsProfileDialogOpen={setIsProfileDialogOpen} />
        </div>
      </div>
    </div>
  );
};

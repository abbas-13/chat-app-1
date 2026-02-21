import { useContext, type Dispatch, type SetStateAction } from "react";

import { Input } from "./ui/input";
import { AuthContext } from "@/context/authContext";
import { ConversationContext } from "@/context/conversationContext";
import { formatConvoDate } from "@/lib/utils";
import type { TConversation, TUser } from "@/assets/types";
import { SidebarProfileMenu } from "./sidebarProfileMenu";
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
    <div className="h-full flex flex-col">
      <div className="flex gap-[0.6rem] h-[58px] justify-center w-full items-center">
        <img style={{ height: "32px" }} src="/social-ly-logo.svg" />
        <h1 className="bg-gradient-to-r from-[#5C5C99] to-[#292966] bg-clip-text text-transparent text-[30px] font-semibold">
          social.ly
        </h1>
      </div>
      <div className="flex flex-col justify-between h-[calc(100%-58px)] p-2">
        <div className="flex flex-col gap-2 overflow-scroll">
          <Input
            onChange={(event) => debouncedSearch(event.target.value)}
            placeholder="search in chats"
            className=" border-1 border-primary focus-visible:ring-1 active:outline-2 active:outline-[#292966] bg-[#f8f8ff]"
          />
          {searchedUsers.length > 0
            ? searchedUsers?.map((item: TUser, index: number) => (
                <div key={index}>
                  <div
                    key={item._id}
                    onClick={() => {
                      setSelectedConversation({
                        recipientId: item._id,
                        recipientName: item.name || item.displayName,
                        recipientDisplayPicture: item.displayPicture,
                        recipientStatus: item.status,
                        recipientDisplayName: item.displayName,
                      });
                      setSearchedUsers([]);
                      if (isMobile) {
                        navigate("/");
                      }
                    }}
                    className="rounded-md h-[56px] flex flex-col hover:bg-background justify-center cursor-pointer"
                  >
                    <h4 className="text-md px-2 font-medium tracking-tight text-left text-foreground">
                      {item.displayName || item.name}
                    </h4>
                  </div>
                  <div className="border border-gray-300 justify-self-center w-full"></div>
                </div>
              ))
            : currConversations?.map((item: TConversation) => {
                const recipient = item.participants.filter(
                  (item) => item._id !== user._id,
                )[0];

                return (
                  <div key={item._id}>
                    <div
                      onClick={() => {
                        setSelectedConversation({
                          recipientId: recipient._id,
                          recipientName:
                            recipient.name || recipient.displayName,
                          recipientDisplayPicture: recipient.displayPicture,
                          recipientStatus: recipient.status,
                          recipientDisplayName: recipient.displayName,
                        });
                        if (isMobile) {
                          navigate("/");
                        }
                      }}
                      className="rounded-md h-[56px] max-h-[56px] px-2 flex flex-col gap-1 hover:bg-background justify-center cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-md font-medium tracking-tight text-left text-foreground">
                          {recipient.displayName ?? recipient.displayName}
                        </h4>
                        <span className="text-[10px] text-gray-600 dark:text-gray-400">
                          {formatConvoDate(item.updatedAt)}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 dark:text-gray-400 text-left truncate">
                        {item.lastMessage.senderId === user._id ? "You: " : ""}
                        {item.lastMessage.text}
                      </span>
                    </div>
                    <div className="border border-gray-300 mt-[2px] w-full justify-self-center"></div>
                  </div>
                );
              })}
        </div>
        <div>
          <div className="border border-gray-300 my-1 w-full justify-self-center"></div>
          <SidebarProfileMenu setIsProfileDialogOpen={setIsProfileDialogOpen} />
        </div>
      </div>
    </div>
  );
};

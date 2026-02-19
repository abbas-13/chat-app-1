import { useContext, useEffect, useState } from "react";

import { Menu } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Sidebar, SidebarContent, useSidebar } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { debounce, formatConvoDate } from "@/lib/utils";
import { AuthContext } from "@/context/authContext";
import { ConversationContext } from "@/context/conversationContext";
import type { TConversation, TUser } from "@/assets/types";
import { ProfileEditDialog } from "./profileEditDialog";
import { SidebarProfileMenu } from "./sidebarProfileMenu";

export const CustomSidebar = () => {
  const { user, socket } = useContext(AuthContext);
  const { setSelectedConversation } = useContext(ConversationContext);
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [currConversations, setCurrConversations] = useState<TConversation[]>(
    [],
  );
  const [searchedUsers, setSearchedUsers] = useState<TUser[]>([]);
  const [isProfileDialogOpen, setIsProfileDialogOpen] =
    useState<boolean>(false);

  const searchUser = async (query: string) => {
    try {
      if (!query.trim()) return;

      const response = await fetch(
        `/api/searchUsers?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const users = await response.json();
      setSearchedUsers(users);
    } catch (err) {
      const errorData = err instanceof Error ? err : "Unkown error occurred";
      console.error(errorData);
    }
  };

  const debouncedSearch = debounce(searchUser, 300);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(errorData);
        }

        const conversations = await response.json();
        setCurrConversations(conversations);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err
            : "Unkown error occurred, couldn't fetch conversations";
        console.error(errorMessage);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleConversationUpdate = (updatedConversation: TConversation) => {
        setCurrConversations((prev) =>
          prev.map((conv: TConversation) =>
            conv._id.toString() === updatedConversation._id.toString()
              ? updatedConversation
              : conv,
          ),
        );
      };

      socket.on("conversationUpdated", handleConversationUpdate);

      return () => {
        socket.off("conversationUpdated", handleConversationUpdate);
      };
    }
  }, [socket]);

  return (
    <div className="h-full flex">
      <Sidebar>
        <SidebarContent className="border-r-2 border-white  bg-[#e6e6ff]">
          <div className="h-full flex flex-col">
            <div className="flex gap-[0.6rem] h-[58px] justify-center w-full items-center">
              <img style={{ height: "32px" }} src="/social-ly-logo.svg" />
              <h1 className="bg-gradient-to-r from-[#5C5C99] to-[#292966] bg-clip-text text-transparent text-[30px] font-semibold">
                social.ly
              </h1>
            </div>
            <div className="flex flex-col justify-between h-[calc(100%-58px)] p-2">
              <div className="flex flex-col gap-2">
                <Input
                  onChange={(event) => debouncedSearch(event.target.value)}
                  placeholder="search in chats"
                  className=" border-2 border-white focus-visible:ring-1 active:outline-2 active:outline-[#292966] bg-[#f8f8ff]"
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
                          }}
                          className="rounded-md h-[56px] flex flex-col hover:bg-background justify-center cursor-pointer"
                        >
                          <h4 className="text-md px-2 font-medium tracking-tight text-left">
                            {item.displayName || item.name}
                          </h4>
                        </div>
                        <div className="border border-gray-300 justify-self-center"></div>
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
                                recipientDisplayPicture:
                                  recipient.displayPicture,
                                recipientStatus: recipient.status,
                                recipientDisplayName: recipient.displayName,
                              });
                            }}
                            className="rounded-md h-[56px] max-h-[56px] px-3 flex flex-col gap-1 hover:bg-background justify-center cursor-pointer"
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="text-mdfont-medium tracking-tight text-left">
                                {recipient.name || recipient.displayName}
                              </h4>
                              <span className="text-[10px] text-gray-500">
                                {formatConvoDate(item.updatedAt)}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 text-left truncate">
                              {item.lastMessage.senderId === user._id
                                ? "You: "
                                : ""}
                              {item.lastMessage.text}
                            </span>
                          </div>
                          <div className="border border-gray-300 mt-[2px] w-full justify-self-center"></div>
                        </div>
                      );
                    })}
              </div>
              <SidebarProfileMenu
                setIsProfileDialogOpen={setIsProfileDialogOpen}
              />
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
      <ProfileEditDialog
        isProfileDialogOpen={isProfileDialogOpen}
        setIsProfileDialogOpen={setIsProfileDialogOpen}
      />
      {isMobile && <Menu onClick={toggleSidebar} />}
    </div>
  );
};

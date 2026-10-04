import { useContext, useEffect, useState } from "react";

import { Sidebar, SidebarContent } from "./ui/sidebar";
import { debounce } from "@/lib/utils";
import { AuthContext } from "@/context/authContext";
import type { TConversation, TUser } from "@/assets/types";
import { ProfileEditDialog } from "./profileEditDialog";
import { CustomSidebarContent } from "./customSidebarContent";

export const CustomSidebar = () => {
  const { socket } = useContext(AuthContext);
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
      if (!response.ok) throw new Error(`Search failed: ${response.status}`);

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
          throw new Error(
            errorData?.error ?? `Request failed: ${response.status}`,
          );
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
        setCurrConversations((prev) => {
          const updatedId = updatedConversation._id.toString();
          const existing = prev.find((c) => c._id.toString() === updatedId);

          // Not in the list yet → drop it at the top.
          if (!existing) return [updatedConversation, ...prev];

          // Already there → replace it and move it to the top.
          const rest = prev.filter((c) => c._id.toString() !== updatedId);
          return [updatedConversation, ...rest];
        });
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
        <SidebarContent className="border-r-2 md:border-primary bg-background">
          <CustomSidebarContent
            debouncedSearch={debouncedSearch}
            searchedUsers={searchedUsers}
            setSearchedUsers={setSearchedUsers}
            currConversations={currConversations}
            setIsProfileDialogOpen={setIsProfileDialogOpen}
          />
        </SidebarContent>
      </Sidebar>
      <ProfileEditDialog
        isProfileDialogOpen={isProfileDialogOpen}
        setIsProfileDialogOpen={setIsProfileDialogOpen}
      />
    </div>
  );
};

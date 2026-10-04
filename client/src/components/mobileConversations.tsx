import { debounce } from "@/lib/utils";
import { CustomSidebarContent } from "./customSidebarContent";
import { useContext, useEffect, useState } from "react";
import type { TConversation, TUser } from "@/assets/types";
import { AuthContext } from "@/context/authContext";
import { ProfileEditDialog } from "./profileEditDialog";

export const MobileConversations = () => {
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

          if (!existing) return [updatedConversation, ...prev];

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
    <>
      <CustomSidebarContent
        debouncedSearch={debouncedSearch}
        searchedUsers={searchedUsers}
        setSearchedUsers={setSearchedUsers}
        currConversations={currConversations}
        setIsProfileDialogOpen={setIsProfileDialogOpen}
      />
      <ProfileEditDialog
        isProfileDialogOpen={isProfileDialogOpen}
        setIsProfileDialogOpen={setIsProfileDialogOpen}
      />
    </>
  );
};

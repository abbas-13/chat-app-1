import { useContext, useEffect, useState } from "react";

import { Sidebar, SidebarContent } from "./ui/sidebar";
import { debounce } from "@/lib/utils";
import { AuthContext } from "@/context/authContext";
import type { TConversation, TUser } from "@/assets/types";
import { ProfileEditDialog } from "./profileEditDialog";
import { CustomSidebarContent } from "./customSidebarContent";

// 224px = 14rem, the sidebar's previous fixed width.
export const MIN_SIDEBAR_WIDTH = 224;
export const MAX_SIDEBAR_WIDTH = 460;

interface TCustomSidebarProps {
  onWidthChange: (width: number) => void;
}

export const CustomSidebar = ({ onWidthChange }: TCustomSidebarProps) => {
  const { socket } = useContext(AuthContext);
  const [currConversations, setCurrConversations] = useState<TConversation[]>(
    [],
  );
  const [searchedUsers, setSearchedUsers] = useState<TUser[]>([]);
  const [isProfileDialogOpen, setIsProfileDialogOpen] =
    useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Listen on window so the pointer can leave the thin handle mid-drag.
  useEffect(() => {
    if (!isResizing) return;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (event: MouseEvent) => {
      onWidthChange(
        Math.min(Math.max(event.clientX, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH),
      );
    };

    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizing, onWidthChange]);

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
        <SidebarContent className="border-r border-border bg-background">
          <CustomSidebarContent
            debouncedSearch={debouncedSearch}
            searchedUsers={searchedUsers}
            setSearchedUsers={setSearchedUsers}
            currConversations={currConversations}
            setIsProfileDialogOpen={setIsProfileDialogOpen}
          />
        </SidebarContent>
      </Sidebar>

      {/* Sits on the sidebar's right edge; --sidebar-width is inherited from
          SidebarProvider, so this tracks whatever width is set. */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onMouseDown={(event) => {
          event.preventDefault();
          setIsResizing(true);
        }}
        onDoubleClick={() => onWidthChange(MIN_SIDEBAR_WIDTH)}
        style={{ left: "calc(var(--sidebar-width) - 3px)" }}
        className={`fixed top-0 z-20 hidden h-svh w-1.5 cursor-col-resize transition-colors md:block ${
          isResizing ? "bg-primary/50" : "bg-transparent hover:bg-primary/30"
        }`}
      />

      <ProfileEditDialog
        isProfileDialogOpen={isProfileDialogOpen}
        setIsProfileDialogOpen={setIsProfileDialogOpen}
      />
    </div>
  );
};

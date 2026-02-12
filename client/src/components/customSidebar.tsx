import { LogIn, LogOut, Menu, Moon, Sun, UserCircleIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ui/themeProvider";
import { Sidebar, SidebarContent, useSidebar } from "./ui/sidebar";
import { Switch } from "./ui/switch";
import { AuthContext } from "@/context/authContext";
import { Avatar } from "./ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { useIsMobile } from "@/hooks/use-mobile";
import { debounce } from "@/lib/utils";
import type { TConversation, TUser } from "@/assets/types";
import { ConversationContext } from "@/context/conversationContext";

export const CustomSidebar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setSelectedConversation } = useContext(ConversationContext);
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currConversations, setCurrConversations] = useState<TConversation[]>(
    [],
  );
  const [searchedUsers, setSearchedUsers] = useState<TUser[]>([]);

  const toggleTheme = (isChecked: boolean) => {
    const selectedTheme = isChecked ? "light" : "dark";
    setTheme(selectedTheme);
  };

  const logout = async () => {
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUser({
          _id: "",
          name: "",
          email: "",
          displayName: "",
        });
        setTheme("light");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      const errorData = err instanceof Error ? err : "Unkown error occurred";
      console.error(errorData);
    }
  };

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

  const sidebarContent = () => {
    return (
      <div className="h-full flex flex-col">
        <div className="flex gap-[0.6rem] h-[54px] justify-center w-full items-center">
          <img style={{ height: "32px" }} src="/social-ly-logo.svg" />
          <h1 className="bg-gradient-to-r from-[#5C5C99] to-[#292966] bg-clip-text text-transparent text-[30px] font-semibold">
            social.ly
          </h1>
        </div>
        <div className="flex flex-col justify-between h-[calc(100%-54px)] p-2">
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
                  console.log(item);
                  return (
                    <div key={item._id}>
                      <div
                        onClick={() => {
                          setSelectedConversation({
                            recipientId: recipient._id,
                            recipientName:
                              recipient.name || recipient.displayName,
                          });
                        }}
                        className="rounded-md h-[56px] max-h-[56px] px-3 flex flex-col gap-1 hover:bg-background justify-center cursor-pointer"
                      >
                        <h4 className="text-mdfont-medium tracking-tight text-left">
                          {recipient.name || recipient.displayName}
                        </h4>
                        <span className="text-[10px] text-gray-500 text-left">
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
          <Menubar className="bg-secondary! p-0">
            <MenubarMenu>
              <MenubarTrigger className="flex justify-between items-center w-full data-[state=open]:bg-background! p-0 h-full px-2 focus:bg-background!s">
                <p className="text-foreground text-sm">
                  {user.name || user.displayName}
                </p>
                <Avatar className="flex justify-end items-center max-h-max">
                  <UserCircleIcon
                    size={20}
                    color={`${theme === "light" ? "#292966" : "#f3f3ff"}`}
                  />
                </Avatar>
              </MenubarTrigger>
              <MenubarContent
                align="center"
                className="w-[var(--radix-menubar-trigger-width)] min-w-0"
              >
                <MenubarItem className="flex justify-between w-full focus:bg-background">
                  {user._id?.length > 0 ? (
                    <div
                      onClick={logout}
                      className="flex justify-between w-full items-center"
                    >
                      <p className="text-foreground text-sm">Logout</p>
                      <LogOut
                        color={`${theme === "light" ? "#292966" : "#f3f3ff"}`}
                        size={20}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        navigate("/login");
                      }}
                      className="flex justify-between w-full items-center"
                    >
                      <p className="text-foreground text-sm">Login</p>
                      <LogIn
                        color={`${theme === "light" ? "#292966" : "#f3f3ff"}`}
                        size={20}
                      />
                    </div>
                  )}
                </MenubarItem>
                <MenubarItem className="flex justify-between w-full focus:bg-background">
                  <p className="text-foreground text-sm">Theme</p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex justify-around text-xs gap-2 items-center"
                  >
                    <Moon size={18} />
                    <Switch
                      className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-foreground"
                      checked={theme === "light" ? true : false}
                      onCheckedChange={(checked) => {
                        event?.stopPropagation();
                        toggleTheme(checked);
                      }}
                    />
                    <Sun size={18} />
                  </div>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-full flex">
        <Sidebar>
          <SidebarContent className="border-r-2 border-white  bg-[#e6e6ff]">
            {sidebarContent()}
          </SidebarContent>
        </Sidebar>
        {isMobile && <Menu onClick={toggleSidebar} />}
      </div>
    </>
  );
};

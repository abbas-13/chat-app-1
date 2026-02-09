import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ui/themeProvider";
import { Sidebar, SidebarContent, useSidebar } from "./ui/sidebar";
import { LogIn, LogOut, Menu, Moon, Sun, UserCircleIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "./ui/switch";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { useNavigate } from "react-router";
import { Avatar } from "./ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";

export const CustomSidebar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  console.log(user);

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
              placeholder="search in chats"
              className=" border-2 border-white focus-visible:ring-1 active:outline-2 active:outline-[#292966] bg-[#f8f8ff]"
            />
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

import { useNavigate } from "react-router";
import { useTheme } from "./ui/themeProvider";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { AuthContext } from "@/context/authContext";
import {
  LogIn,
  LogOut,
  Moon,
  Sun,
  UserCircleIcon,
  UserRoundCog,
} from "lucide-react";

import { Switch } from "./ui/switch";
import { Avatar } from "./ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/menubar";

interface TSidebarProfileMenuProps {
  setIsProfileDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const SidebarProfileMenu = ({
  setIsProfileDialogOpen,
}: TSidebarProfileMenuProps) => {
  const { user, setUser, disconnectSocket } = useContext(AuthContext);

  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
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
          displayPicture: "",
          status: "",
        });
        disconnectSocket();
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
  return (
    <Menubar className="bg-secondary! p-0">
      <MenubarMenu>
        <MenubarTrigger className="flex justify-between items-center w-full data-[state=open]:bg-background! p-0 h-full px-2 focus:bg-background!s">
          <p className="text-foreground text-sm">
            {user.name || user.displayName}
          </p>
          <Avatar size="sm" className="flex justify-end items-center max-h-max">
            {user.displayPicture ? (
              <img src={user.displayPicture} />
            ) : (
              <UserCircleIcon
                size={20}
                color={`${theme === "light" ? "#292966" : "#f3f3ff"}`}
              />
            )}
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
              <Moon
                size={18}
                color={`${theme === "light" ? "#292966" : "#f3f3ff"}`}
              />
              <Switch
                className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-foreground"
                checked={theme === "light" ? true : false}
                onCheckedChange={(checked) => {
                  event?.stopPropagation();
                  toggleTheme(checked);
                }}
              />
              <Sun
                size={18}
                color={`${theme === "light" ? "#292966" : "#f3f3ff"}`}
              />
            </div>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            onClick={() => setIsProfileDialogOpen(true)}
            className="flex justify-between w-full focus:bg-background"
          >
            <p className="text-foreground text-sm">My profile</p>
            <div className="flex justify-around text-xs gap-2 items-center">
              <UserRoundCog
                color={`${theme === "light" ? "#292966" : "#f3f3ff"}`}
              />
            </div>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

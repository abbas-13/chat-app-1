import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ui/themeProvider";
import { Sidebar, SidebarContent, useSidebar } from "./ui/sidebar";
import { LogIn, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "./ui/switch";

export const CustomSidebar = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();

  const toggleTheme = (isChecked: boolean) => {
    const selectedTheme = isChecked ? "light" : "dark";
    setTheme(selectedTheme);
  };

  const sidebarContent = () => {
    return (
      <div className="gap-[0.6rem] h-full! flex flex-col">
        <div className="flex gap-[0.6rem] p-2 justify-center w-full items-center">
          <img style={{ height: "32px" }} src="/social-ly-logo.svg" />
          <h1 className="bg-gradient-to-r from-[#5C5C99] to-[#292966] bg-clip-text text-transparent text-[30px] font-semibold">
            social.ly
          </h1>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-2 p-2">
            <Input className=" border-2 border-white focus-visible:ring-1 active:outline-2 active:outline-[#292966] bg-[#f8f8ff]" />
            <div className="h-[38px] bg-white p-2 rounded-md border-b"></div>{" "}
            <div className="h-[38px] bg-white p-2 rounded-md border-b"></div>
            <div className="h-[38px] bg-white p-2 rounded-md border-b"></div>
            <div className="h-[38px] bg-white p-2 rounded-md border-b"></div>
          </div>
          <div>
            <div className="border border-white m-2"></div>
            <div className="flex justify-between w-full p-2 px-4 mb-2">
              <p className="text-foreground">Theme</p>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex justify-around text-xs gap-2 items-center"
              >
                <Moon size={18} />
                <Switch
                  checked={theme === "light" ? true : false}
                  onCheckedChange={(checked) => {
                    event?.stopPropagation();
                    toggleTheme(checked);
                  }}
                />
                <Sun size={18} />
              </div>
            </div>
            <div
              //   onClick={logOut}
              className="flex justify-between w-full p-2 px-4 mb-2 active:bg-gray-600 rounded-md"
            >
              {/* {user._id?.length > 0 ? ( */}
              <div className="flex justify-between w-full items-center">
                <p className="text-foreground">Logout</p>
                <LogOut className="color-foreground" size={20} />
              </div>
              {/* ) : ( */}
              <div className="flex justify-between w-full items-center">
                <p className="text-foreground">Login</p>
                <LogIn className="color-foreground" size={20} />
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-screen flex">
        <Sidebar>
          <SidebarContent className="border-r-2 border-white bg-[#e6e6ff]">
            {sidebarContent()}
          </SidebarContent>
        </Sidebar>
        {isMobile && <Menu onClick={toggleSidebar} />}
      </div>
    </>
  );
};

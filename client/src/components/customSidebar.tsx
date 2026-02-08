import { Input } from "@/components/ui/input";
import { Sidebar, SidebarContent, useSidebar } from "./ui/sidebar";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const CustomSidebar = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  const sidebarContent = () => {
    return (
      <div className="gap-[0.6rem] flex flex-col">
        <div className="flex gap-[0.6rem] p-2 justify-center w-full items-center">
          <img style={{ height: "32px" }} src="/social-ly-logo.svg" />
          <h1 className="bg-gradient-to-r from-[#5C5C99] to-[#292966] bg-clip-text text-transparent text-[30px] font-semibold">
            social.ly
          </h1>
        </div>
        <div className="p-2 flex flex-col gap-2">
          <Input className="border-2 border-white focus-visible:ring-1 active:outline-2 active:outline-[#292966] bg-[#f8f8ff]" />
          <div className="h-[38px] bg-white p-2 rounded-md border-b"></div>{" "}
          <div className="h-[38px] bg-white p-2 rounded-md border-b"></div>
          <div className="h-[38px] bg-white p-2 rounded-md border-b"></div>
          <div className="h-[38px] bg-white p-2 rounded-md border-b"></div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-screen flex">
        <div></div>
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

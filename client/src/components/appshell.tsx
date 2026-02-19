import { SidebarProvider } from "./ui/sidebar";
import { useState } from "react";
import { CustomSidebar } from "./customSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface TAppshellProps {
  children: React.ReactNode;
}
export const Appshell = ({ children }: TAppshellProps) => {
  const [open, setOpen] = useState<boolean>(true);
  const isMobile = useIsMobile();

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      {!isMobile && <CustomSidebar />}
      <main className="bg-[#e6e6ff] w-full h-screen outline-none">
        {children}
      </main>
    </SidebarProvider>
  );
};

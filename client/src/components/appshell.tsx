import { SidebarProvider } from "./ui/sidebar";
import { useState } from "react";
import { CustomSidebar, MIN_SIDEBAR_WIDTH } from "./customSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface TAppshellProps {
  children: React.ReactNode;
}
export const Appshell = ({ children }: TAppshellProps) => {
  const [open, setOpen] = useState<boolean>(true);
  const [sidebarWidth, setSidebarWidth] = useState<number>(MIN_SIDEBAR_WIDTH);
  const isMobile = useIsMobile();

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
    >
      {!isMobile && <CustomSidebar onWidthChange={setSidebarWidth} />}
      <main className="bg-background w-full h-screen outline-none">
        {children}
      </main>
    </SidebarProvider>
  );
};

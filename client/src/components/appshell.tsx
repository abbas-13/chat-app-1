import { SidebarProvider } from "./ui/sidebar";
import { useState } from "react";
import { CustomSidebar } from "./customSidebar";

interface TAppshellProps {
  children: React.ReactNode;
}
export const Appshell = ({ children }: TAppshellProps) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <CustomSidebar />
      <main className="bg-[#e6e6ff] w-full h-screen outline-none">
        {children}
      </main>
    </SidebarProvider>
  );
};

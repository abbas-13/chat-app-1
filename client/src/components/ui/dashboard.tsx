import { useIsMobile } from "@/hooks/use-mobile";
import { Navbar } from "../navbar";

export const Dashboard = () => {
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && <Navbar />}
      <div className="w-full h-full bg-background"></div>
    </>
  );
};

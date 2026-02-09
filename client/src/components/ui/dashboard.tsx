import { useIsMobile } from "@/hooks/use-mobile";
import { Navbar } from "../navbar";

export const Dashboard = () => {
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && <Navbar />}
      <div className="w-full h-[calc(100%-54px)] bg-background"></div>
    </>
  );
};

import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

export const AppShell = ({ children }) => (
  <div className="flex flex-col h-full">
    <NavBar />
    {children}
    <Footer className="align-baseline items-baseline justify-center" />
  </div>
);

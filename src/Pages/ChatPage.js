import { ChatBox } from "../components/ChatBox";
import { Sidebar } from "../components/Sidebar";

export const ChatPage = () => {
  return (
    <div className="flex p-8 gap-4" style={{ height: "calc(100% - 10rem)" }}>
      <div className="w-1/4 h-full">
        <Sidebar />
      </div>
      <div className="w-3/4 h-full">
        <ChatBox />
      </div>
    </div>
  );
};

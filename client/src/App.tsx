import { Route, Routes } from "react-router";
import { useState } from "react";

import "./App.css";
import { ThemeProvider } from "./components/ui/themeProvider";
import { Appshell } from "./components/appshell";
import { Dashboard } from "./components/dashboard";
import { Login } from "./components/loginPage";
import { SignUp } from "./components/signupPage";
import { Auth } from "./components/auth";
import { ConversationContext } from "./context/conversationContext";
import type { TMessage, TSelectedConversation } from "./assets/types";
import type { Socket } from "socket.io-client";

function App() {
  const [selectedConversation, setSelectedConversation] =
    useState<TSelectedConversation>({
      recipientId: "",
      recipientName: "",
    });
  const [messages, setMessages] = useState<TMessage[]>([]);

  const subscribeToMessage = (recipientId: string, socket: Socket) => {
    if (!recipientId) return;

    socket?.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
  };

  const unsubscribeFromMessages = (socket: Socket) => {
    if (socket) socket.off("newMessage");
  };

  return (
    <ThemeProvider defaultTheme="light">
      <Auth>
        <ConversationContext.Provider
          value={{
            selectedConversation,
            setSelectedConversation,
            messages,
            setMessages,
            subscribeToMessage,
            unsubscribeFromMessages,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Appshell>
                  <Dashboard />
                </Appshell>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </ConversationContext.Provider>
      </Auth>
    </ThemeProvider>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Auth } from "./components/Auth";
import { ChatContextProvider } from "./context/ChatContext";
import { ChatPage } from "./Pages/ChatPage";
import { LoginPage } from "./Pages/LoginPage";
import { SignUpPage } from "./Pages/SignUpPage";

function App() {
  return (
    <Auth>
      <ChatContextProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/"
            element={
              <AppShell>
                <ChatPage />
              </AppShell>
            }
          />
        </Routes>
      </ChatContextProvider>
    </Auth>
  );
}

export default App;

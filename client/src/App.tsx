import { Route, Routes } from "react-router";
import "./App.css";

import { Appshell } from "./components/appshell";
import { Dashboard } from "./components/dashboard";
import { ThemeProvider } from "./components/ui/themeProvider";
import { Login } from "./components/loginPage";
import { SignUp } from "./components/signupPage";
import { Auth } from "./components/auth";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Auth>
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
      </Auth>
    </ThemeProvider>
  );
}

export default App;

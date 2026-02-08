import "./App.css";
import { Appshell } from "./components/appshell";
import { Dashboard } from "./components/ui/dashboard";
import { ThemeProvider } from "./components/ui/themeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Appshell>
        <Dashboard />
      </Appshell>
    </ThemeProvider>
  );
}

export default App;

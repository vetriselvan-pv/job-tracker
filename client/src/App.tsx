import "./App.css";
import { ThemeToggle } from "./components/theme-toggle";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Outlet />
      <ThemeToggle />
    </>
  );
}

export default App;

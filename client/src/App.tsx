import "./App.css";
import { ThemeToggle } from "./components/theme-toggle";
import FloatingMenuBar from "./components/FloatingMenuBar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Outlet />
      <FloatingMenuBar />
      <ThemeToggle />
    </>
  );
}


export default App;

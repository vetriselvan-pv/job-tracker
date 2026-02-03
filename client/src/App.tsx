import "./App.css"; 
import FloatingMenuBar from "./components/FloatingMenuBar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Outlet />
      <FloatingMenuBar /> 
    </>
  );
}


export default App;

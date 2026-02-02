import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import ProtectedRoute from "./protected-route.tsx";
import Dashboard from "./pages/Dashboard.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Login />} />

          /** ProtectedRoute */
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} /> 
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

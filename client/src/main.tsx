import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import TestTable from "./pages/TestTable.tsx";
import ProtectedRoute from "./protected-route.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AddJob from "./pages/AddJob.tsx";
import { AuthProvider } from "./auth-context.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="test-table" element={<TestTable />} />

            {/* ProtectedRoute */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-job" element={<AddJob />} />
              <Route path="edit-job/:id" element={<AddJob />} />
            </Route>

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);

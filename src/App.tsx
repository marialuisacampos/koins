import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/Login";
import { SignUp } from "@/pages/SignUp";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { Dashboard } from "@/pages/Dashboard";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<SignUp />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

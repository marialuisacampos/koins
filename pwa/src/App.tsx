import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/pages/Login";
import { SignUp } from "@/pages/SignUp";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { Dashboard } from "@/pages/Dashboard";
import { Expenses } from "@/pages/Expenses";
import { Settings } from "@/pages/Settings";
import { authService } from "@/services/auth.service";
import { ToastProvider } from "@/contexts/ToastContext";
import { Toaster } from "@/components/Toast";
import { Toast } from "@/components/Toast";

export const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const initializeAuth = async () => {
      const hasRefreshToken = !!localStorage.getItem('refreshToken');
      
      if (hasRefreshToken) {
        await authService.refreshTokenOnStartup();
      }
      
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const handleCloseToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <ToastProvider toasts={toasts} setToasts={setToasts}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<SignUp />} />
          <Route path="/recuperar-senha" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/extrato" element={<Expenses />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Routes>
        <Toaster toasts={toasts} onClose={handleCloseToast} />
      </BrowserRouter>
    </ToastProvider>
  );
};

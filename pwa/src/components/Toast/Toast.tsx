import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import styles from "./Toast.module.scss";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const ToastComponent = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <XCircle size={20} />;
      case "info":
        return <AlertCircle size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <div className={styles.icon}>{getIcon()}</div>
      <p className={styles.message}>{toast.message}</p>
      <button
        className={styles.closeButton}
        onClick={() => onClose(toast.id)}
        aria-label="Fechar"
      >
        <X size={16} />
      </button>
    </div>
  );
};


import { ToastComponent, Toast } from "./Toast";
import styles from "./Toaster.module.scss";

interface ToasterProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const Toaster = ({ toasts, onClose }: ToasterProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};


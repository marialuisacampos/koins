import { Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import styles from "./Header.module.scss";

interface HeaderProps {
  onSettings: () => void;
  onLogout: () => void;
}

export const Header = ({ onSettings, onLogout }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Logo size={40} />
          <span className={styles.logoText}>Koins</span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.iconButton}
            onClick={onSettings}
            aria-label="Configurações"
          >
            <Settings size={20} />
          </button>

          <button
            className={styles.iconButton}
            onClick={onLogout}
            aria-label="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};


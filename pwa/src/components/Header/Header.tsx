import { Logo } from "@/components/Logo";
import styles from "./Header.module.scss";

interface HeaderProps {
  userName?: string;
}

export const Header = ({ userName }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Logo size={40} />
          <span className={styles.logoText}>Koins</span>
        </div>

        {userName && (
          <div className={styles.greeting}>
            <span className={styles.greetingText}>Olá, {userName}!</span>
          </div>
        )}
      </div>
    </header>
  );
};


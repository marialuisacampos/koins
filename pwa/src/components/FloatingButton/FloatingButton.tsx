import { ButtonHTMLAttributes } from "react";
import styles from "./FloatingButton.module.scss";

interface FloatingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export const FloatingButton = ({
  children,
  icon,
  ariaLabel,
  ...props
}: FloatingButtonProps) => {
  return (
    <button className={styles.button} aria-label={ariaLabel} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.text}>{children}</span>}
    </button>
  );
};


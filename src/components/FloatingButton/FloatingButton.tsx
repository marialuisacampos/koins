import { ButtonHTMLAttributes } from "react";
import styles from "./FloatingButton.module.scss";

interface FloatingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const FloatingButton = ({
  children,
  icon,
  ...props
}: FloatingButtonProps) => {
  return (
    <button className={styles.button} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </button>
  );
};


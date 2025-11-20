import { ReactNode } from "react";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  children?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {(action || children) && (
        <div className={styles.action}>{action || children}</div>
      )}
    </div>
  );
};


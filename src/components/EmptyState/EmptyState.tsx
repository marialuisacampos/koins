import { ReactNode } from "react";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};


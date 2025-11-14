import { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.scss';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
}

export const Card = ({
  children,
  padding = 'md',
  elevated = false,
  className = '',
  ...props
}: CardProps) => {
  const cardClasses = [
    styles.card,
    styles[padding],
    elevated && styles.elevated,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};


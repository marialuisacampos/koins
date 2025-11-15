import styles from './Logo.module.scss';

interface LogoProps {
  size?: number;
  animated?: boolean;
}

export const Logo = ({ size = 80, animated = false }: LogoProps) => {
  return (
    <div className={`${styles.logoContainer} ${animated ? styles.animated : ''}`}>
      <img
        src="/logo.svg"
        alt="Koins Logo"
        width={size}
        height={size}
        className={styles.logo}
      />
    </div>
  );
};


import styles from './Logo.module.scss';

interface LogoProps {
  size?: number;
  animated?: boolean;
}

export const Logo = ({ size = 80, animated = false }: LogoProps) => {
  return (
    <div className={`${styles.logoContainer} ${animated ? styles.animated : ''}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.logo}
      >
        <circle
          cx="60"
          cy="60"
          r="58"
          stroke="#FF6B35"
          strokeWidth="2"
          fill="none"
          className={styles.coin}
        />
        
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="#FF6B35"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />

        <g className={styles.fishTop}>
          <path
            d="M60 30 C45 30, 35 40, 35 52 C35 64, 45 74, 60 74 C60 74, 60 30, 60 30 Z"
            fill="#FF6B35"
            opacity="0.9"
          />
          <circle cx="48" cy="45" r="2.5" fill="white" />
          <path
            d="M38 52 Q42 50, 46 52"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M32 48 L28 44 L32 46 L30 42 L32 48 Z"
            fill="#FF6B35"
            opacity="0.7"
          />
        </g>

        <g className={styles.fishBottom}>
          <path
            d="M60 90 C75 90, 85 80, 85 68 C85 56, 75 46, 60 46 C60 46, 60 90, 60 90 Z"
            fill="#1A1A1A"
            opacity="0.85"
          />
          <circle cx="72" cy="75" r="2.5" fill="white" />
          <path
            d="M82 68 Q78 70, 74 68"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M88 72 L92 76 L88 74 L90 78 L88 72 Z"
            fill="#1A1A1A"
            opacity="0.7"
          />
        </g>

        <circle cx="60" cy="60" r="8" fill="#FFD700" opacity="0.9" />
        <text
          x="60"
          y="65"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#FF6B35"
        >
          K
        </text>
      </svg>
    </div>
  );
};


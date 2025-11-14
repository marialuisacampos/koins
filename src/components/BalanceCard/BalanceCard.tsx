import { Card } from "@/components/Card";
import styles from "./BalanceCard.module.scss";

interface BalanceCardProps {
  userName: string;
  partnerName: string;
  balance: number;
}

export const BalanceCard = ({
  userName,
  partnerName,
  balance,
}: BalanceCardProps) => {
  const isPositive = balance > 0;
  const isZero = balance === 0;
  const absBalance = Math.abs(balance);

  const getBalanceMessage = () => {
    if (isZero) {
      return {
        title: "Tudo certo! 🎉",
        description: "Vocês estão em dia",
      };
    }

    if (isPositive) {
      return {
        title: `${partnerName} precisa equilibrar com você`,
        description: "Aguardando acerto",
      };
    }

    return {
      title: `Você precisa equilibrar com ${partnerName}`,
      description: "Ajuste em aberto",
    };
  };

  const message = getBalanceMessage();

  return (
    <Card padding="lg" elevated className={styles.card}>
      <div className={styles.header}>
        <div className={styles.users}>
          <div className={styles.userBadge}>{userName[0]}</div>
          <div className={styles.connector}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 8l4 4-4 4M3 12h18" />
            </svg>
          </div>
          <div className={styles.userBadge}>{partnerName[0]}</div>
        </div>
        <span className={styles.names}>
          {userName} & {partnerName}
        </span>
      </div>

      <div className={styles.balance}>
        <p className={styles.balanceLabel}>{message.title}</p>
        {!isZero && (
          <p className={styles.balanceAmount}>
            R$ {absBalance.toFixed(2).replace(".", ",")}
          </p>
        )}
        <p className={styles.balanceDescription}>{message.description}</p>
      </div>
    </Card>
  );
};


import { Receipt } from "lucide-react";
import styles from "./ExpenseItem.module.scss";

interface ExpenseItemProps {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  category?: string;
}

export const ExpenseItem = ({
  description,
  amount,
  paidBy,
  date,
  category,
}: ExpenseItemProps) => {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  const formattedAmount = amount.toFixed(2).replace(".", ",");

  return (
    <div className={styles.item}>
      <div className={styles.icon}>
        <Receipt size={20} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <p className={styles.description}>{description}</p>
          <p className={styles.amount}>R$ {formattedAmount}</p>
        </div>
        <div className={styles.meta}>
          <span className={styles.paidBy}>{paidBy} pagou</span>
          <span className={styles.separator}>•</span>
          <span className={styles.date}>{formattedDate}</span>
          {category && (
            <>
              <span className={styles.separator}>•</span>
              <span className={styles.category}>{category}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


import { useState, FormEvent, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import styles from "./AddExpenseModal.module.scss";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExpenseData) => void;
}

export interface ExpenseData {
  type: "transfer" | "payment";
  amount: number;
  splitHalf: boolean;
}

export const AddExpenseModal = ({
  isOpen,
  onClose,
  onSave,
}: AddExpenseModalProps) => {
  const [type, setType] = useState<"transfer" | "payment">("payment");
  const [amount, setAmount] = useState("");
  const [splitHalf, setSplitHalf] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (type === "transfer") {
      setSplitHalf(false);
    }
  }, [type]);

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^\d,]/g, "");
    setAmount(cleaned);
    setError("");
  };

  const parseAmount = (value: string): number => {
    const normalized = value.replace(",", ".");
    return parseFloat(normalized) || 0;
  };

  const getDisplayAmount = (): string => {
    if (!amount) return "R$ 0,00";

    const numericAmount = parseAmount(amount);
    const finalAmount = splitHalf ? numericAmount / 2 : numericAmount;

    return `R$ ${finalAmount.toFixed(2).replace(".", ",")}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!amount) {
      setError("Digite um valor");
      return;
    }

    const numericAmount = parseAmount(amount);

    if (numericAmount <= 0) {
      setError("O valor deve ser maior que zero");
      return;
    }

    const finalAmount = splitHalf ? numericAmount / 2 : numericAmount;

    onSave({
      type,
      amount: finalAmount,
      splitHalf,
    });

    handleCancel();
  };

  const handleCancel = () => {
    setType("payment");
    setAmount("");
    setSplitHalf(false);
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Adicionar despesa">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <label className={styles.sectionLabel}>O que aconteceu?</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioOption}>
              <input
                type="radio"
                name="type"
                value="payment"
                checked={type === "payment"}
                onChange={() => setType("payment")}
                className={styles.radioInput}
              />
              <span className={styles.radioLabel}>
                <span className={styles.radioCircle}></span>
                <span className={styles.radioText}>
                  <strong>Paguei algo</strong>
                  <small>Registrar uma despesa que você pagou</small>
                </span>
              </span>
            </label>

            <label className={styles.radioOption}>
              <input
                type="radio"
                name="type"
                value="transfer"
                checked={type === "transfer"}
                onChange={() => setType("transfer")}
                className={styles.radioInput}
              />
              <span className={styles.radioLabel}>
                <span className={styles.radioCircle}></span>
                <span className={styles.radioText}>
                  <strong>Transferência de dinheiro</strong>
                  <small>Registrar um repasse para seu par</small>
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <Input
            type="text"
            label="Quanto foi?"
            placeholder="0,00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            error={error}
            fullWidth
          />
        </div>

        {type === "payment" && (
          <div className={styles.section}>
            <label className={styles.toggleContainer}>
              <input
                type="checkbox"
                checked={splitHalf}
                onChange={(e) => setSplitHalf(e.target.checked)}
                className={styles.toggleInput}
              />
              <span className={styles.toggleSwitch}></span>
              <span className={styles.toggleLabel}>
                <span>Vocês vão rachar esse valor?</span>
                <small>
                  {splitHalf
                    ? `Dos R$ ${
                        amount || "0,00"
                      }, você registra R$ ${getDisplayAmount().replace(
                        "R$ ",
                        ""
                      )} (metade)`
                    : "O valor total vai para o saldo"}
                </small>
              </span>
            </label>
          </div>
        )}

        {amount && (
          <div className={styles.preview}>
            <span className={styles.previewLabel}>Valor final:</span>
            <span className={styles.previewAmount}>{getDisplayAmount()}</span>
          </div>
        )}

        <div className={styles.actions}>
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Salvar despesa
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
};

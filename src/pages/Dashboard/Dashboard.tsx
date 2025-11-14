import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Plus, Mail, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { BalanceCard } from "@/components/BalanceCard";
import { ExpenseItem } from "@/components/ExpenseItem";
import { FloatingButton } from "@/components/FloatingButton";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { AddExpenseModal, ExpenseData } from "@/components/AddExpenseModal";
import styles from "./Dashboard.module.scss";

type ConnectionStatus =
  | "no_connection"
  | "invite_sent"
  | "pending_request"
  | "connected";

interface PendingRequest {
  name: string;
  email: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  category?: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connected");
  const [pendingRequest] = useState<PendingRequest>({
    name: "Maria Silva",
    email: "maria@email.com",
  });
  const [invitedEmail, setInvitedEmail] = useState("");
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  const [userName] = useState("João");
  const [partnerName] = useState("Maria");
  const [balance] = useState(150.5);
  const [expenses] = useState<Expense[]>([
    {
      id: "1",
      description: "Mercado",
      amount: 250.0,
      paidBy: "Maria",
      date: "2024-11-12",
      category: "Alimentação",
    },
    {
      id: "2",
      description: "Conta de luz",
      amount: 180.5,
      paidBy: "João",
      date: "2024-11-10",
      category: "Contas",
    },
    {
      id: "3",
      description: "Netflix",
      amount: 55.9,
      paidBy: "Maria",
      date: "2024-11-08",
      category: "Entretenimento",
    },
  ]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSettings = () => {
    console.log("Abrir configurações");
  };

  const handleAddExpense = () => {
    setIsAddExpenseModalOpen(true);
  };

  const handleSaveExpense = (data: ExpenseData) => {
    console.log("Salvar despesa:", data);
    setIsAddExpenseModalOpen(false);
  };

  const handleSendInvite = (email: string) => {
    console.log("Enviar convite para:", email);
    setInvitedEmail(email);
    setConnectionStatus("invite_sent");
  };

  const handleCancelInvite = () => {
    console.log("Cancelar convite para:", invitedEmail);
    setInvitedEmail("");
    setConnectionStatus("no_connection");
  };

  const handleAcceptRequest = () => {
    setConnectionStatus("connected");
  };

  const handleRejectRequest = () => {
    setConnectionStatus("no_connection");
  };

  if (connectionStatus === "no_connection") {
    return (
      <div className={styles.container}>
        <Header onSettings={handleSettings} onLogout={handleLogout} />
        <main className={styles.mainCentered}>
          <NoConnectionState onSendInvite={handleSendInvite} />
        </main>
      </div>
    );
  }

  if (connectionStatus === "invite_sent") {
    return (
      <div className={styles.container}>
        <Header onSettings={handleSettings} onLogout={handleLogout} />
        <main className={styles.mainCentered}>
          <InviteSentState
            email={invitedEmail}
            onCancelInvite={handleCancelInvite}
          />
        </main>
      </div>
    );
  }

  if (connectionStatus === "pending_request") {
    return (
      <div className={styles.container}>
        <Header onSettings={handleSettings} onLogout={handleLogout} />
        <main className={styles.mainCentered}>
          <PendingRequestState
            request={pendingRequest}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header onSettings={handleSettings} onLogout={handleLogout} />
      <main className={styles.main}>
        <div className={styles.content}>
          <BalanceCard
            userName={userName}
            partnerName={partnerName}
            balance={balance}
          />

          <section className={styles.expenses}>
            <div className={styles.expensesHeader}>
              <h2 className={styles.expensesTitle}>Extrato</h2>
              <button
                className={styles.seeAllButton}
                onClick={() => navigate("/extrato")}
              >
                Ver tudo
              </button>
            </div>

            <Card padding="sm">
              <div className={styles.expensesList}>
                {expenses.map((expense) => (
                  <ExpenseItem key={expense.id} {...expense} />
                ))}
              </div>
            </Card>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <FloatingButton
          onClick={handleAddExpense}
          icon={<Plus size={22} strokeWidth={2.5} />}
        >
          Adicionar despesa
        </FloatingButton>
      </footer>

      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        onSave={handleSaveExpense}
      />
    </div>
  );
};

const NoConnectionState = ({
  onSendInvite,
}: {
  onSendInvite: (email: string) => void;
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email é obrigatório");
      return;
    }
    onSendInvite(email);
  };

  return (
    <EmptyState
      icon={<UserPlus size={48} strokeWidth={2} />}
      title="Conecte-se com seu par"
      description="Para começar a gerenciar suas finanças juntos, envie um convite para seu parceiro(a)"
      action={
        <form onSubmit={handleSubmit} className={styles.inviteForm}>
          <Input
            type="email"
            placeholder="Email do seu par"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            fullWidth
            icon={<Mail size={20} />}
          />
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Enviar convite
          </Button>
        </form>
      }
    />
  );
};

const InviteSentState = ({
  email,
  onCancelInvite,
}: {
  email: string;
  onCancelInvite: () => void;
}) => {
  return (
    <div className={styles.inviteSent}>
      <div className={styles.inviteSentIcon}>
        <CheckCircle size={48} strokeWidth={2} />
      </div>
      <h2 className={styles.inviteSentTitle}>Convite enviado!</h2>
      <p className={styles.inviteSentDescription}>
        Enviamos um convite para <strong>{email}</strong>. Aguarde a resposta do
        seu par para começar a gerenciar as finanças juntos.
      </p>
      <p className={styles.inviteSentInfo}>
        Enquanto isso, você pode cancelar o convite e enviar para outro email,
        se desejar.
      </p>

      <div className={styles.inviteSentActions}>
        <Button variant="ghost" size="lg" fullWidth onClick={onCancelInvite}>
          Cancelar convite
        </Button>
      </div>
    </div>
  );
};

const PendingRequestState = ({
  request,
  onAccept,
  onReject,
}: {
  request: PendingRequest;
  onAccept: () => void;
  onReject: () => void;
}) => {
  return (
    <div className={styles.pendingRequest}>
      <div className={styles.requestIcon}>
        <UserPlus size={48} strokeWidth={2} />
      </div>
      <h2 className={styles.requestTitle}>Nova solicitação!</h2>
      <p className={styles.requestDescription}>
        <strong>{request.name}</strong> ({request.email}) quer se conectar com
        você para gerenciar as finanças juntos.
      </p>

      <div className={styles.requestActions}>
        <Button variant="primary" size="lg" fullWidth onClick={onAccept}>
          Aceitar convite
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={onReject}>
          Recusar
        </Button>
      </div>
    </div>
  );
};

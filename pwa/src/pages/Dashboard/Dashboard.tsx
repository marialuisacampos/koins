import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Plus,
  Mail,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
} from "lucide-react";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { BalanceCard } from "@/components/BalanceCard";
import { ExpenseItem } from "@/components/ExpenseItem";
import { FloatingButton } from "@/components/FloatingButton";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { AddExpenseModal, ExpenseData } from "@/components/AddExpenseModal";
import { authService } from "@/services/auth.service";
import {
  connectionService,
  ConnectionState,
} from "@/services/connection.service";
import styles from "./Dashboard.module.scss";

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
  const [connectionState, setConnectionState] =
    useState<ConnectionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const user = authService.getUser();
  const [userName] = useState(user?.name || "Usuário");
  const [balance] = useState(0);
  const [expenses] = useState<Expense[]>([]);

  const getPartnerName = (): string => {
    if (
      connectionState?.status !== "connected" ||
      !connectionState?.connection
    ) {
      return "Parceiro";
    }

    const connection = connectionState.connection;
    const currentUserId = user?.id;

    if (connection.user_from?.id === currentUserId) {
      return connection.user_to?.name || "Parceiro";
    }

    if (connection.user_to?.id === currentUserId) {
      return connection.user_from?.name || "Parceiro";
    }

    return "Parceiro";
  };

  const partnerName = getPartnerName();

  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    loadConnectionState();
  }, []);

  const loadConnectionState = async () => {
    try {
      setIsLoading(true);
      const state = await connectionService.getConnectionState();
      setConnectionState(state);
    } catch (error) {
      console.error("Erro ao carregar estado da conexão:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleSettings = () => {
    navigate("/configuracoes");
  };

  const handleAddExpense = () => {
    setIsAddExpenseModalOpen(true);
  };

  const handleSaveExpense = (data: ExpenseData) => {
    console.log("Salvar despesa:", data);
    setIsAddExpenseModalOpen(false);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail || isProcessing) return;

    try {
      setIsProcessing(true);
      await connectionService.sendInvite(inviteEmail);
      await loadConnectionState();
      setInviteEmail("");
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      alert("Erro ao enviar convite. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelInvite = async () => {
    if (!connectionState?.connection || isProcessing) return;

    try {
      setIsProcessing(true);
      await connectionService.cancelInvite(connectionState.connection.id);
      await loadConnectionState();
    } catch (error) {
      console.error("Erro ao cancelar convite:", error);
      alert("Erro ao cancelar convite. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!connectionState?.connection || isProcessing) return;

    try {
      setIsProcessing(true);
      await connectionService.acceptConnection(connectionState.connection.id);
      await loadConnectionState();
    } catch (error) {
      console.error("Erro ao aceitar convite:", error);
      alert("Erro ao aceitar convite. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!connectionState?.connection || isProcessing) return;

    try {
      setIsProcessing(true);
      await connectionService.rejectConnection(connectionState.connection.id);
      await loadConnectionState();
    } catch (error) {
      console.error("Erro ao rejeitar convite:", error);
      alert("Erro ao rejeitar convite. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header userName={userName} />
        <main className={`${styles.main} ${styles.mainCentered}`}>
          <div className={styles.loading}>Carregando...</div>
        </main>
      </div>
    );
  }

  const status = connectionState?.status || "no_connection";

  return (
    <div className={styles.container}>
      <Header userName={userName} />

      <main
        className={`${styles.main} ${
          status !== "connected" ? styles.mainCentered : styles.mainWithFooter
        }`}
      >
        {status === "no_connection" && (
          <EmptyState
            icon={<UserPlus size={64} />}
            title="Comece a gerenciar suas finanças"
            description="Envie um convite para seu par começar a usar o Koins juntos"
          >
            <div className={styles.inviteForm}>
              <Input
                type="email"
                placeholder="Email do seu par"
                icon={<Mail size={20} />}
                fullWidth
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleSendInvite}
                loading={isProcessing}
                disabled={!inviteEmail || isProcessing}
              >
                Enviar convite
              </Button>
            </div>
          </EmptyState>
        )}

        {status === "invite_sent" &&
          (() => {
            const email =
              connectionState?.connection?.partner_email ||
              connectionState?.connection?.user_to?.email ||
              "seu par";
            const isPending = !connectionState?.connection?.user_id_to;

            return (
              <EmptyState
                icon={isPending ? <Clock size={64} /> : <Mail size={64} />}
                title={isPending ? "Aguardando cadastro" : "Convite enviado!"}
                description={
                  isPending
                    ? `Você enviou um convite para ${email}. Assim que seu par criar uma conta, o convite aparecerá para ele aceitar.`
                    : `Seu convite foi enviado. Aguardando ${email} aceitar para começarem a usar o Koins juntos.`
                }
              >
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleCancelInvite}
                  loading={isProcessing}
                  fullWidth
                >
                  Cancelar convite
                </Button>
              </EmptyState>
            );
          })()}

        {status === "pending_request" &&
          (() => {
            const inviter = connectionState?.connection?.user_from;

            return (
              <EmptyState
                icon={<CheckCircle size={64} />}
                title={`${inviter?.name || "Alguém"} quer se conectar!`}
                description={`${
                  inviter?.email || "Um usuário"
                } enviou uma solicitação de conexão. Aceite para começarem a gerenciar suas finanças juntos.`}
              >
                <div className={styles.actionsGroup}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleAcceptRequest}
                    loading={isProcessing}
                    fullWidth
                  >
                    Aceitar
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleRejectRequest}
                    disabled={isProcessing}
                    fullWidth
                  >
                    Recusar
                  </Button>
                </div>
              </EmptyState>
            );
          })()}

        {status === "connected" && (
          <>
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
                    {expenses.length === 0 ? (
                      <div className={styles.emptyExpenses}>
                        Nenhuma despesa registrada ainda
                      </div>
                    ) : (
                      expenses.map((expense) => (
                        <ExpenseItem key={expense.id} {...expense} />
                      ))
                    )}
                  </div>
                </Card>
              </section>
            </div>
          </>
        )}
      </main>

      <div className={styles.footerActions}>
        {status === "connected" ? (
          <>
            <button
              className={styles.footerIconButton}
              onClick={handleSettings}
              aria-label="Configurações"
            >
              <Settings size={24} />
            </button>
            <FloatingButton
              icon={<Plus size={24} />}
              onClick={handleAddExpense}
              ariaLabel="Adicionar despesa"
            />
            <button
              className={styles.footerIconButton}
              onClick={handleLogout}
              aria-label="Sair"
            >
              <LogOut size={24} />
            </button>
          </>
        ) : (
          <div className={styles.footerActionsCentered}>
            <button
              className={styles.footerIconButton}
              onClick={handleSettings}
              aria-label="Configurações"
            >
              <Settings size={24} />
            </button>
            <button
              className={styles.footerIconButton}
              onClick={handleLogout}
              aria-label="Sair"
            >
              <LogOut size={24} />
            </button>
          </div>
        )}
      </div>

      {isAddExpenseModalOpen && (
        <AddExpenseModal
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};

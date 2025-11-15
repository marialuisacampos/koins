import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, CreditCard, AlertTriangle } from "lucide-react";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import styles from "./Settings.module.scss";

export const Settings = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Preencha todos os campos");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não conferem");
      return;
    }

    setIsChangingPassword(true);

    setTimeout(() => {
      console.log("Senha alterada");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      alert("Senha alterada com sucesso!");
    }, 1000);
  };

  const handleCancelSubscription = () => {
    console.log("Cancelar assinatura. Motivo:", cancelReason);
    setIsCancelModalOpen(false);
    setCancelReason("");
    alert("Assinatura cancelada. Sentiremos sua falta!");
  };

  const handleUpgrade = () => {
    console.log("Upgrade para plano anual");
    alert("Redirecionando para página de pagamento...");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/dashboard")}
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>Configurações</h1>
        <div className={styles.placeholder}></div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Lock size={20} className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Segurança</h2>
            </div>

            <Card padding="lg">
              <form onSubmit={handleChangePassword} className={styles.form}>
                <h3 className={styles.formTitle}>Trocar senha</h3>
                <p className={styles.formDescription}>
                  Atualize sua senha para manter sua conta segura
                </p>

                <Input
                  type="password"
                  label="Senha atual"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  autoComplete="current-password"
                />

                <Input
                  type="password"
                  label="Nova senha"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={passwordError}
                  fullWidth
                  autoComplete="new-password"
                />

                <Input
                  type="password"
                  label="Confirmar nova senha"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Salvando..." : "Salvar nova senha"}
                </Button>
              </form>
            </Card>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <CreditCard size={20} className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Plano</h2>
            </div>

            <Card padding="lg" className={styles.planCard}>
              <div className={styles.planBadge}>Plano Mensal</div>
              <h3 className={styles.planTitle}>R$ 19,90/mês</h3>
              <p className={styles.planDescription}>
                Você está no plano mensal. Faça upgrade para o plano anual e
                economize 20%!
              </p>

              <div className={styles.upgradeOffer}>
                <div className={styles.upgradeDetails}>
                  <span className={styles.upgradePrice}>R$ 190,80/ano</span>
                  <span className={styles.upgradeSavings}>
                    Economize R$ 47,20
                  </span>
                </div>
                <Button variant="primary" size="md" onClick={handleUpgrade}>
                  Fazer upgrade
                </Button>
              </div>
            </Card>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <AlertTriangle size={20} className={styles.dangerIcon} />
              <h2 className={styles.sectionTitle}>Zona de perigo</h2>
            </div>

            <Card padding="lg">
              <div className={styles.dangerZone}>
                <div className={styles.dangerInfo}>
                  <h3 className={styles.dangerTitle}>Cancelar assinatura</h3>
                  <p className={styles.dangerDescription}>
                    Cancele sua assinatura e perca acesso a todas as
                    funcionalidades premium
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setIsCancelModalOpen(true)}
                  className={styles.dangerButton}
                >
                  Cancelar assinatura
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancelar assinatura"
      >
        <div className={styles.cancelModal}>
          <p className={styles.cancelWarning}>
            Tem certeza que deseja cancelar sua assinatura? Você perderá acesso
            a todas as funcionalidades do Koins.
          </p>

          <div className={styles.cancelForm}>
            <label className={styles.cancelLabel}>
              Conte-nos o motivo (opcional)
            </label>
            <textarea
              className={styles.cancelTextarea}
              placeholder="Por que você está cancelando?"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              maxLength={200}
            />
            <span className={styles.cancelCounter}>
              {cancelReason.length}/200
            </span>
          </div>

          <div className={styles.cancelActions}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => setIsCancelModalOpen(false)}
            >
              Manter assinatura
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleCancelSubscription}
            >
              Confirmar cancelamento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


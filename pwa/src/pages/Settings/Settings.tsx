import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api";
import { useToast } from "@/components/Toast";
import styles from "./Settings.module.scss";

export const Settings = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
      showSuccess("Senha alterada com sucesso!");
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Digite sua senha para confirmar");
      return;
    }

    setIsDeletingAccount(true);

    try {
      await authService.deleteAccount(
        deletePassword,
        deleteReason || undefined
      );
      showSuccess("Conta excluída com sucesso. Sentiremos sua falta!");
      navigate("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        setDeleteError(error.message);
      } else {
        setDeleteError("Erro ao excluir conta. Tente novamente.");
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteReason("");
    setDeletePassword("");
    setDeleteError("");
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

          {/* <section className={styles.section}>
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
          </section> */}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <AlertTriangle size={20} className={styles.dangerIcon} />
              <h2 className={styles.sectionTitle}>Zona de perigo</h2>
            </div>

            <Card padding="lg">
              <div className={styles.dangerZone}>
                <div className={styles.dangerInfo}>
                  <h3 className={styles.dangerTitle}>Excluir conta</h3>
                  <p className={styles.dangerDescription}>
                    Exclua sua conta permanentemente. Todos os seus dados serão
                    perdidos e não poderão ser recuperados
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className={styles.dangerButton}
                >
                  Excluir conta
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Excluir conta"
      >
        <div className={styles.cancelModal}>
          <p className={styles.cancelWarning}>
            Tem certeza que deseja excluir sua conta? Esta ação é permanente e
            todos os seus dados serão perdidos para sempre.
          </p>

          {deleteError && (
            <div className={styles.errorMessage}>{deleteError}</div>
          )}

          <div className={styles.cancelForm}>
            <Input
              type="password"
              label="Digite sua senha para confirmar"
              placeholder="••••••••"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              error={
                deleteError && !deletePassword ? "Senha é obrigatória" : ""
              }
              fullWidth
              autoComplete="current-password"
              icon={<Lock size={20} />}
            />

            <label className={styles.cancelLabel}>
              Conte-nos o motivo (opcional)
            </label>
            <textarea
              className={styles.cancelTextarea}
              placeholder="Por que você está saindo?"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={4}
              maxLength={200}
            />
            <span className={styles.cancelCounter}>
              {deleteReason.length}/200
            </span>
          </div>

          <div className={styles.cancelActions}>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={handleCloseDeleteModal}
              disabled={isDeletingAccount}
            >
              Manter conta
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleDeleteAccount}
              loading={isDeletingAccount}
            >
              Excluir definitivamente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

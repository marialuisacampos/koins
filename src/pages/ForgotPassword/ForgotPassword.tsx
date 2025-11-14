import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import styles from "./ForgotPassword.module.scss";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Email é obrigatório");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  const handleResend = () => {
    setIsSent(false);
    setEmail("");
  };

  if (isSent) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.successIcon}>
              <CheckCircle size={48} strokeWidth={2} />
            </div>
            <h1 className={styles.title}>Email enviado!</h1>
            <p className={styles.subtitle}>
              Enviamos um link de recuperação para <strong>{email}</strong>
            </p>
            <p className={styles.description}>
              Verifique sua caixa de entrada e siga as instruções para
              redefinir sua senha. O link expira em 24 horas.
            </p>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" size="lg" fullWidth onClick={() => navigate("/login")}>
              Voltar para o login
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={handleResend}>
              Reenviar email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Logo size={100} animated />
          <h1 className={styles.title}>Recuperar senha</h1>
          <p className={styles.subtitle}>
            Informe seu email para receber um link de recuperação
          </p>
        </div>

        <Card padding="lg" elevated>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              fullWidth
              autoComplete="email"
              autoFocus
              icon={<Mail size={20} />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Enviar link de recuperação
            </Button>
          </form>
        </Card>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Lembrou sua senha?{" "}
            <Link to="/login" className={styles.footerLink}>
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


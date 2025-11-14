import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
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
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
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


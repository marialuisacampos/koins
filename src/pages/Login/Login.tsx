import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import styles from "./Login.module.scss";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Logo size={120} animated />
          <h1 className={styles.title}>Koins</h1>
          <p className={styles.subtitle}>Equilíbrio financeiro a dois</p>
        </div>

        <Card padding="lg" elevated>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <Input
                type="email"
                label="Email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                fullWidth
                autoComplete="email"
                icon={<Mail size={20} />}
              />

              <Input
                type="password"
                label="Senha"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                fullWidth
                autoComplete="current-password"
                icon={<Lock size={20} />}
              />
            </div>

            <Link to="/recuperar-senha" className={styles.forgotPassword}>
              Esqueceu sua senha?
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Entrar
            </Button>
          </form>
        </Card>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Não tem uma conta?{" "}
            <Link to="/cadastro" className={styles.footerLink}>
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

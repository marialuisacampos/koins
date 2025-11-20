import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api";
import styles from "./SignUp.module.scss";

export const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    general: "",
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(?(\d{2})\)?\s?9?\d{4}-?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      general: "",
    };

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (name.trim().length < 2) {
      newErrors.name = "Nome deve ter no mínimo 2 caracteres";
    }

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }

    if (!phone) {
      newErrors.phone = "Celular é obrigatório";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Celular inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 8) {
      newErrors.password = "Senha deve ter no mínimo 8 caracteres";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    setIsLoading(true);

    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const formattedPhone = cleanPhone.length === 11 ? `+55${cleanPhone}` : undefined;

      await authService.signup({
        name: name.trim(),
        email: email.toLowerCase(),
        phone: formattedPhone,
        password,
      });

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          const apiErrors = { ...newErrors };
          error.errors.forEach((err) => {
            if (err.field in apiErrors) {
              apiErrors[err.field as keyof typeof apiErrors] = err.message;
            }
          });
          setErrors(apiErrors);
        } else {
          setErrors({ ...newErrors, general: error.message });
        }
      } else {
        setErrors({ ...newErrors, general: "Erro ao criar conta. Tente novamente." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Logo size={100} animated />
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>
            Comece a gerenciar suas finanças a dois
          </p>
        </div>

        <Card padding="lg" elevated>
          <form onSubmit={handleSubmit} className={styles.form}>
            {errors.general && (
              <div className={styles.errorMessage}>
                {errors.general}
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <Input
                type="text"
                label="Como você quer ser chamado?"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                fullWidth
                autoComplete="name"
                icon={<User size={20} />}
              />

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
                type="tel"
                label="Celular"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                error={errors.phone}
                fullWidth
                autoComplete="tel"
                maxLength={15}
                icon={<Phone size={20} />}
              />

              <Input
                type="password"
                label="Senha"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                fullWidth
                autoComplete="new-password"
                icon={<Lock size={20} />}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Criar conta
            </Button>
          </form>
        </Card>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Já tem uma conta?{" "}
            <Link to="/login" className={styles.footerLink}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


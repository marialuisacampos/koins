import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, X } from "lucide-react";
import { ExpenseItem } from "@/components/ExpenseItem";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import styles from "./Expenses.module.scss";

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  category?: string;
}

export const Expenses = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

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
    {
      id: "4",
      description: "Farmácia",
      amount: 89.9,
      paidBy: "João",
      date: "2024-11-07",
      category: "Saúde",
    },
    {
      id: "5",
      description: "Restaurante",
      amount: 145.0,
      paidBy: "Maria",
      date: "2024-11-05",
      category: "Alimentação",
    },
    {
      id: "6",
      description: "Uber",
      amount: 32.5,
      paidBy: "João",
      date: "2024-11-04",
      category: "Transporte",
    },
    {
      id: "7",
      description: "Internet",
      amount: 99.9,
      paidBy: "Maria",
      date: "2024-11-03",
      category: "Contas",
    },
    {
      id: "8",
      description: "Padaria",
      amount: 28.5,
      paidBy: "João",
      date: "2024-11-02",
      category: "Alimentação",
    },
  ]);

  const filteredExpenses = useMemo(() => {
    if (selectedMonth === null && selectedYear === null) {
      return expenses;
    }

    return expenses.filter((expense) => {
      const date = new Date(expense.date);
      const expenseMonth = date.getMonth();
      const expenseYear = date.getFullYear();

      const monthMatches =
        selectedMonth === null || expenseMonth === selectedMonth;
      const yearMatches =
        selectedYear === null || expenseYear === selectedYear;

      return monthMatches && yearMatches;
    });
  }, [expenses, selectedMonth, selectedYear]);

  const availableYears = useMemo(() => {
    const years = expenses.map((expense) =>
      new Date(expense.date).getFullYear()
    );
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [expenses]);

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const groupExpensesByMonth = () => {
    const grouped: { [key: string]: Expense[] } = {};

    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = date.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      const capitalizedMonth =
        monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

      if (!grouped[capitalizedMonth]) {
        grouped[capitalizedMonth] = [];
      }
      grouped[capitalizedMonth].push(expense);
    });

    return grouped;
  };

  const groupedExpenses = groupExpensesByMonth();

  const handleClearFilters = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    setIsFilterOpen(false);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const hasActiveFilters = selectedMonth !== null || selectedYear !== null;

  const getFilterLabel = () => {
    if (!hasActiveFilters) return null;

    const parts: string[] = [];
    if (selectedMonth !== null) parts.push(months[selectedMonth]);
    if (selectedYear !== null) parts.push(selectedYear.toString());

    return parts.join(" de ");
  };

  const calculateMonthTotal = (monthExpenses: Expense[]) => {
    return monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
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
        <h1 className={styles.title}>Extrato completo</h1>
        <button
          className={`${styles.filterButton} ${hasActiveFilters ? styles.filterActive : ""}`}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-label="Filtrar"
        >
          <Filter size={20} />
        </button>
      </header>

      {isFilterOpen && (
        <div className={styles.filterPanel}>
          <div className={styles.filterContent}>
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Mês</label>
              <div className={styles.filterOptions}>
                <button
                  className={`${styles.filterOption} ${selectedMonth === null ? styles.selected : ""}`}
                  onClick={() => setSelectedMonth(null)}
                >
                  Todos
                </button>
                {months.map((month, index) => (
                  <button
                    key={month}
                    className={`${styles.filterOption} ${selectedMonth === index ? styles.selected : ""}`}
                    onClick={() => setSelectedMonth(index)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Ano</label>
              <div className={styles.filterOptions}>
                <button
                  className={`${styles.filterOption} ${selectedYear === null ? styles.selected : ""}`}
                  onClick={() => setSelectedYear(null)}
                >
                  Todos
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    className={`${styles.filterOption} ${selectedYear === year ? styles.selected : ""}`}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterActions}>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={handleClearFilters}
              >
                Limpar filtros
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleApplyFilters}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className={styles.activeFilter}>
          <span className={styles.activeFilterText}>
            Exibindo: {getFilterLabel()}
          </span>
          <button
            className={styles.clearFilterButton}
            onClick={handleClearFilters}
            aria-label="Limpar filtros"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.content}>
          {Object.entries(groupedExpenses).map(([month, monthExpenses]) => (
            <section key={month} className={styles.monthSection}>
              <div className={styles.monthHeader}>
                <h2 className={styles.monthTitle}>{month}</h2>
                <span className={styles.monthTotal}>
                  R$ {calculateMonthTotal(monthExpenses).toFixed(2).replace(".", ",")}
                </span>
              </div>

              <Card padding="sm">
                <div className={styles.expensesList}>
                  {monthExpenses.map((expense) => (
                    <ExpenseItem key={expense.id} {...expense} />
                  ))}
                </div>
              </Card>
            </section>
          ))}

          {filteredExpenses.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.emptyText}>
                {hasActiveFilters
                  ? "Nenhuma despesa encontrada com esses filtros"
                  : "Nenhuma despesa registrada ainda"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};


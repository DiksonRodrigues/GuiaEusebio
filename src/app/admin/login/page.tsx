"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/businesses");
    } else {
      setError("Senha incorreta.");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Painel Admin</h1>
        <p className={styles.loginSub}>GuiaEusébio — acesso restrito</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ width: "100%", marginTop: "1.25rem", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          {error && <p className={styles.loginError}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

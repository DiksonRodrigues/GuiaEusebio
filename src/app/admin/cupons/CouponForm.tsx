"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import styles from "../admin.module.css";

type Business = { id: string; name: string };

type CouponData = {
  id?: string;
  business_id: string;
  code: string;
  discount_label: string;
  description: string;
  expires_at: string;
  active: boolean;
};

const STOP_WORDS = new Set(["de", "do", "da", "no", "na", "em", "e", "o", "a", "os", "as", "um", "uma", "para", "pra"]);

function generateCode(label: string): string {
  const cleaned = label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")   // remove acentos (range correto)
    .replace(/[R$%]/g, "")             // remove símbolos monetários
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")       // só letras, números, espaços
    .trim();

  const words = cleaned
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()));

  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 7);

  // iniciais das primeiras palavras + última palavra completa, máx 7
  const last = words[words.length - 1];
  const initials = words.slice(0, -1).map((w) =>
    /^\d+$/.test(w) ? w.slice(0, 2) : w[0]
  ).join("");
  return (initials + last).slice(0, 7);
}

const empty: CouponData = {
  business_id: "",
  code: "",
  discount_label: "",
  description: "",
  expires_at: "",
  active: true,
};

export default function CouponForm({
  businesses,
  initial,
}: {
  businesses: Business[];
  initial?: CouponData;
}) {
  const isEdit = !!initial?.id;
  const router = useRouter();

  const [form, setForm] = useState<CouponData>(
    initial
      ? {
          ...initial,
          expires_at: initial.expires_at
            ? new Date(initial.expires_at).toISOString().split("T")[0]
            : "",
        }
      : empty
  );
  const [codeManual, setCodeManual] = useState(isEdit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof CouponData, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleDiscountChange = (value: string) => {
    setForm((f) => ({
      ...f,
      discount_label: value,
      code: codeManual ? f.code : generateCode(value),
    }));
  };

  const handleCodeChange = (value: string) => {
    setCodeManual(true);
    set("code", value.toUpperCase());
  };

  const handleCodeClear = () => {
    setCodeManual(false);
    setForm((f) => ({ ...f, code: generateCode(f.discount_label) }));
  };

  const handleSubmit = async () => {
    if (!form.business_id || !form.code || !form.discount_label) {
      setError("Estabelecimento, código e desconto são obrigatórios.");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      code: form.code.toUpperCase().trim(),
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };
    delete (payload as any).id;

    try {
      const url = isEdit ? `/api/admin/coupons/${initial!.id}` : "/api/admin/coupons";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/cupons");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.formGrid}>

          <div className={`${styles.field} ${styles.formFull}`}>
            <label className={styles.label}>Estabelecimento *</label>
            <select
              className={styles.select}
              value={form.business_id}
              onChange={(e) => set("business_id", e.target.value)}
            >
              <option value="">Selecione um estabelecimento...</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Desconto *</label>
            <input
              className={styles.input}
              value={form.discount_label}
              onChange={(e) => handleDiscountChange(e.target.value)}
              placeholder="Ex: 20% OFF, R$10 OFF, Entrega Grátis"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Código do cupom *</span>
              {codeManual && (
                <button
                  type="button"
                  onClick={handleCodeClear}
                  style={{ fontSize: "0.72rem", color: "#5b21b6", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  ↺ Gerar automático
                </button>
              )}
            </label>
            <input
              className={styles.input}
              value={form.code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Gerado automaticamente pelo desconto"
              style={{ fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em" }}
            />
            {!codeManual && form.code && (
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Gerado automaticamente — edite para personalizar</span>
            )}
          </div>

          <div className={`${styles.field} ${styles.formFull}`}>
            <label className={styles.label}>Descrição</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Ex: Em compras acima de R$50, válido apenas no local..."
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Válido até (opcional)</label>
            <input
              className={styles.input}
              type="date"
              value={form.expires_at}
              onChange={(e) => set("expires_at", e.target.value)}
            />
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Deixe em branco para sem validade</span>
          </div>

          <div className={styles.field} style={{ justifyContent: "flex-end" }}>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => set("active", e.target.checked)}
              />
              Cupom ativo (visível no site)
            </label>
          </div>

        </div>
      </div>

      {error && <p style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</p>}

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmit}
          disabled={loading}
          style={{ minWidth: 160, justifyContent: "center" }}
        >
          {loading
            ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Salvando...</>
            : isEdit ? "Salvar alterações" : "Criar cupom"}
        </button>
        <a href="/admin/cupons" className={`${styles.btn} ${styles.btnOutline}`}>Cancelar</a>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

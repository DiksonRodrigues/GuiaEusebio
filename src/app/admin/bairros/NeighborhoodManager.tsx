"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Check, X, GripVertical, Loader2 } from "lucide-react";
import styles from "../admin.module.css";

type Neighborhood = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  position: number;
};

export default function NeighborhoodManager({
  initial,
}: {
  initial: Neighborhood[];
}) {
  const router = useRouter();
  const [neighborhoods, setNeighborhoods] = useState(initial);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = () => router.refresh();

  const handleCreate = async () => {
    if (newName.trim().length < 2) { setError("Nome mín. 2 caracteres."); return; }
    setLoading("create");
    setError("");
    const res = await fetch("/api/admin/neighborhoods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(null); return; }
    setNeighborhoods((prev) => [...prev, data].sort((a, b) => a.position - b.position));
    setNewName("");
    setLoading(null);
    refresh();
  };

  const handleToggle = async (n: Neighborhood) => {
    setLoading(n.id + "_toggle");
    const res = await fetch(`/api/admin/neighborhoods/${n.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !n.is_active }),
    });
    if (res.ok) {
      setNeighborhoods((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_active: !n.is_active } : x))
      );
    }
    setLoading(null);
    refresh();
  };

  const startEdit = (n: Neighborhood) => {
    setEditingId(n.id);
    setEditName(n.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (editName.trim().length < 2) { setError("Nome mín. 2 caracteres."); return; }
    setLoading(id + "_edit");
    setError("");
    const res = await fetch(`/api/admin/neighborhoods/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(null); return; }
    setNeighborhoods((prev) =>
      prev.map((x) => (x.id === id ? { ...x, name: data.name, slug: data.slug } : x))
    );
    setEditingId(null);
    setLoading(null);
    refresh();
  };

  const handleDelete = async (n: Neighborhood) => {
    if (!confirm(`Excluir "${n.name}"? Negócios vinculados perderão o bairro.`)) return;
    setLoading(n.id + "_del");
    await fetch(`/api/admin/neighborhoods/${n.id}`, { method: "DELETE" });
    setNeighborhoods((prev) => prev.filter((x) => x.id !== n.id));
    setLoading(null);
    refresh();
  };

  return (
    <div>
      {/* Create form */}
      <div className={styles.card}>
        <p style={{ fontWeight: 700, color: "#1e1b4b", marginBottom: "1rem" }}>
          Novo bairro
        </p>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <input
            className={styles.input}
            placeholder="Nome do bairro..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            style={{ maxWidth: 320 }}
          />
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleCreate}
            disabled={loading === "create"}
          >
            {loading === "create"
              ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
              : <Plus size={15} />}
            Adicionar
          </button>
        </div>
        {error && (
          <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.5rem" }}>{error}</p>
        )}
      </div>

      {/* List */}
      <div className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 32 }}></th>
              <th>Nome</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {neighborhoods.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                  Nenhum bairro cadastrado.
                </td>
              </tr>
            )}
            {neighborhoods.map((n) => (
              <tr key={n.id}>
                <td>
                  <GripVertical size={16} style={{ color: "#cbd5e1", cursor: "grab" }} />
                </td>
                <td style={{ fontWeight: 600 }}>
                  {editingId === n.id ? (
                    <input
                      className={styles.input}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(n.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.85rem" }}
                      autoFocus
                    />
                  ) : (
                    n.name
                  )}
                </td>
                <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{n.slug}</td>
                <td>
                  <span
                    className={`${styles.badge} ${n.is_active ? styles.badgeGreen : styles.badgeGray}`}
                  >
                    {n.is_active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {editingId === n.id ? (
                      <>
                        <button
                          className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                          onClick={() => handleSaveEdit(n.id)}
                          disabled={loading === n.id + "_edit"}
                        >
                          {loading === n.id + "_edit"
                            ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                            : <Check size={12} />}
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                          onClick={() => setEditingId(null)}
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                          onClick={() => startEdit(n)}
                        >
                          <Pencil size={12} /> Editar
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                          onClick={() => handleToggle(n)}
                          disabled={loading === n.id + "_toggle"}
                          style={{ color: n.is_active ? "#f59e0b" : "#16a34a" }}
                        >
                          {n.is_active ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                          onClick={() => handleDelete(n)}
                          disabled={loading === n.id + "_del"}
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

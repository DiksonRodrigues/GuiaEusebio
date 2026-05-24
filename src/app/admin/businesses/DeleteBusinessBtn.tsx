"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

export default function DeleteBusinessBtn({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) return;
    await fetch(`/api/admin/businesses/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
      onClick={handleDelete}
    >
      <Trash2 size={13} /> Excluir
    </button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import styles from "../admin.module.css";

export default function DeleteCouponBtn({ id, code }: { id: string; code: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Excluir cupom "${code}"?`)) return;
    setLoading(true);
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
    >
      <Trash2 size={13} />
    </button>
  );
}

import AdminShell from "@/components/AdminShell/AdminShell";
import styles from "../../admin.module.css";
import SupermarketForm from "../SupermarketForm";

export default function NewSupermarketPage() {
  return (
    <AdminShell>
      <div className={styles.topbar}>
        <h1 className={styles.pageTitle}>Novo Supermercado</h1>
      </div>
      <SupermarketForm />
    </AdminShell>
  );
}

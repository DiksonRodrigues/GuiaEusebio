import type { Metadata } from "next";
import "../../app/globals.css";
import styles from "./admin.module.css";

export const metadata: Metadata = { title: "Admin — GuiaEusébio" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={styles.adminBody}>
        {children}
      </body>
    </html>
  );
}

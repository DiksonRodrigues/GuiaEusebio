import { getCoupons } from "@/lib/database";
import { cityConfig } from "@/config/city";
import CouponSection from "@/components/CouponSection/CouponSection";
import { Tag } from "lucide-react";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Cupons de Desconto — ${cityConfig.appTitle}`,
  description: `Economize com cupons exclusivos nos melhores estabelecimentos de ${cityConfig.name}.`,
};

export default async function CuponsPage() {
  const coupons = await getCoupons();

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.hero}>
          <Tag size={32} className={styles.heroIcon} />
          <h1 className={styles.heroTitle}>Cupons de Desconto</h1>
          <p className={styles.heroSub}>
            Economize nos melhores estabelecimentos de {cityConfig.name}
          </p>
        </div>
      </div>

      <CouponSection coupons={coupons ?? []} emptyMessage="Nenhum cupom disponível no momento. Volte em breve!" hideHeader />
    </div>
  );
}

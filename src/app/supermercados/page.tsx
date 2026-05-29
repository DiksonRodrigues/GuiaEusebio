import { getSupermarkets } from "@/lib/database";
import { cityConfig } from "@/config/city";
import Link from "next/link";
import { ShoppingCart, MapPin, Phone, ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Encartes de Supermercados — ${cityConfig.appTitle}`,
  description: `Confira os encartes semanais e ofertas dos supermercados de ${cityConfig.name}.`,
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default async function SupermercadosPage() {
  const supermarkets = await getSupermarkets();

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.heroIcon}><ShoppingCart size={36} /></div>
          <h1 className={styles.heroTitle}>Encartes de Supermercados</h1>
          <p className={styles.heroSub}>
            Ofertas e encartes semanais dos supermercados de {cityConfig.name}
          </p>
        </div>

        {supermarkets.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingCart size={48} />
            <p>Nenhum supermercado cadastrado ainda.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {supermarkets.map((s: any) => (
              <Link key={s.id} href={`/supermercados/${s.slug}`} className={`${styles.card} glass-card`}>
                <div className={styles.cardCover}>
                  {s.cover_url
                    ? <Image src={s.cover_url} alt={`${s.name} capa`} fill sizes="(max-width:640px) 100vw, 400px" style={{ objectFit: "cover" }} />
                    : <div className={styles.coverPlaceholder}><ShoppingCart size={40} /></div>}
                  {s.activeFlyer
                    ? <span className={styles.badgeActive}>
                        <CalendarDays size={12} />
                        Até {formatDate(s.activeFlyer.valid_until)}
                      </span>
                    : <span className={styles.badgeEmpty}>Sem encarte</span>}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    {s.logo_url && (
                      <div className={styles.logoWrap}>
                        <Image src={s.logo_url} alt={s.name} fill sizes="48px" style={{ objectFit: "contain" }} />
                      </div>
                    )}
                    <h2 className={styles.cardName}>{s.name}</h2>
                  </div>

                  {s.description && (
                    <p className={styles.cardDesc}>{s.description}</p>
                  )}

                  <div className={styles.cardMeta}>
                    {s.address && (
                      <span className={styles.metaItem}>
                        <MapPin size={13} /> {s.address}
                      </span>
                    )}
                    {s.phone && (
                      <span className={styles.metaItem}>
                        <Phone size={13} /> {s.phone}
                      </span>
                    )}
                  </div>

                  <div className={styles.cardCta}>
                    {s.activeFlyer ? "Ver encarte e ofertas" : "Ver supermercado"}
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

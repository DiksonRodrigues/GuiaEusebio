import Link from "next/link";
import { MapPin, Mail, ArrowRight } from "lucide-react";
import { cityConfig } from "@/config/city";
import styles from "./Footer.module.css";

const EXPLORE_LINKS = [
  { label: "Início",         href: "/" },
  { label: "Categorias",     href: "/categories" },
  { label: "Cupons",         href: "/cupons" },
  { label: "Encartes",       href: "/supermercados" },
  { label: "Bairros",        href: "/bairros" },
  { label: "Busca",          href: "/search" },
];

const BUSINESS_LINKS = [
  { label: "Cadastrar meu negócio", href: "/advertise" },
  { label: "Sobre nós",             href: "/about" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              Guia<span className="gradient-text">{cityConfig.name}</span>
            </Link>
            <p className={styles.brandDesc}>
              O guia completo de negócios e serviços de{" "}
              <strong>{cityConfig.name}</strong>, {cityConfig.state}.
              Encontre estabelecimentos, cupons e promoções perto de você.
            </p>
            <span className={styles.location}>
              <MapPin size={14} /> {cityConfig.name}, {cityConfig.state}
            </span>
          </div>

          {/* Explore */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Explorar</h3>
            <ul className={styles.linkList}>
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.link}>
                    <ArrowRight size={12} className={styles.linkArrow} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Para Negócios</h3>
            <ul className={styles.linkList}>
              {BUSINESS_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.link}>
                    <ArrowRight size={12} className={styles.linkArrow} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.ctaBox}>
              <p className={styles.ctaText}>Tem um negócio em {cityConfig.name}?</p>
              <Link href="/advertise" className={styles.ctaBtn}>
                Anunciar grátis
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Contato</h3>
            <a href={`mailto:${cityConfig.contactEmail}`} className={styles.contactItem}>
              <Mail size={15} />
              {cityConfig.contactEmail}
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {year} Guia{cityConfig.name}. Todos os direitos reservados.
          </p>
          <p className={styles.made}>
            Feito com ❤️ para {cityConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

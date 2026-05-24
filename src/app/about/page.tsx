import { MapPin, Target, Users, Star, Zap, Heart } from "lucide-react";
import { cityConfig } from "@/config/city";
import Link from "next/link";
import styles from "./about.module.css";

export const metadata = {
  title: `Sobre Nós | Guia${cityConfig.name}`,
  description: `Conheça o Guia${cityConfig.name}, a plataforma que conecta você aos melhores negócios locais de ${cityConfig.name}.`,
};

const valores = [
  {
    icon: Target,
    title: "Nossa Missão",
    description: `Conectar moradores de ${cityConfig.name} aos melhores estabelecimentos locais, valorizando o comércio da nossa cidade e fortalecendo a economia regional.`,
    color: "#2563eb",
  },
  {
    icon: Heart,
    title: "Nossa Paixão",
    description: "Acreditamos que pequenos negócios são a alma de uma cidade. Cada estabelecimento tem uma história, e queremos ajudar a contá-la.",
    color: "#e11d48",
  },
  {
    icon: Zap,
    title: "Nossa Tecnologia",
    description: "Usamos tecnologia de ponta para oferecer uma experiência rápida, bonita e acessível, tanto no celular quanto no computador.",
    color: "#f59e0b",
  },
];

const stats = [
  { value: "20+", label: "Estabelecimentos" },
  { value: "8+",  label: "Categorias" },
  { value: "100%", label: "Gratuito para usuários" },
  { value: "24/7", label: "Disponível" },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.badge}>
              <MapPin size={14} /> {cityConfig.name}, Ceará
            </span>
            <h1 className={styles.heroTitle}>
              Feito com ❤️ para{" "}
              <span className="gradient-text">{cityConfig.name}</span>
            </h1>
            <p className={styles.heroSubtitle}>
              O <strong>Guia{cityConfig.name}</strong> nasceu da vontade de valorizar
              o comércio local e facilitar a vida de quem mora e trabalha aqui.
            </p>
            <Link href="/advertise" className={styles.ctaButton}>
              Anunciar meu Negócio
            </Link>
          </div>
        </div>
        <div className={styles.heroBg} aria-hidden="true" />
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={`${styles.statCard} glass-card`}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className={`${styles.valoresSection} section`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Por que existimos?</h2>
            <p>Três pilares que guiam tudo o que fazemos</p>
          </div>
          <div className={styles.valoresGrid}>
            {valores.map((v) => (
              <div key={v.title} className={`${styles.valorCard} glass-card`}>
                <div className={styles.valorIcon} style={{ background: `${v.color}22`, color: v.color }}>
                  <v.icon size={28} />
                </div>
                <h3 className={styles.valorTitle}>{v.title}</h3>
                <p className={styles.valorDesc}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={`${styles.ctaCard} glass-card`}>
            <Users size={48} className={styles.ctaIcon} />
            <h2>Você tem um negócio em {cityConfig.name}?</h2>
            <p>
              Cadastre seu estabelecimento gratuitamente e comece a ser encontrado
              por milhares de moradores da cidade.
            </p>
            <Link href="/advertise" className={styles.ctaButton}>
              Quero Anunciar Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

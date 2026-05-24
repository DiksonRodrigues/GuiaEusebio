"use client";

import Link from "next/link";
import { cityConfig } from "@/config/city";
import NavSearch from "@/components/NavSearch/NavSearch";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.navContainer}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span>Guia<span className="gradient-text">{cityConfig.name}</span></span>
            <span className={styles.tagline}>Seu guia de descontos locais</span>
          </Link>

          {/* Desktop Links - escondidos no mobile */}
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Início</Link>
            <Link href="/categories" className={styles.navLink}>Categorias</Link>
            <Link href="/cupons" className={styles.navLink}>Cupons</Link>
            <Link href="/supermercados" className={`${styles.navLink} ${styles.navLinkHighlight}`}>Supermercados</Link>
            <Link href="/about" className={styles.navLink}>Sobre</Link>
          </div>

          <NavSearch />
        </div>
      </div>
    </nav>
  );
}

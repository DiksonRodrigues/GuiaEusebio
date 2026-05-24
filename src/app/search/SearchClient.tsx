"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, ArrowLeft, SearchX, Loader2 } from "lucide-react";
import { cityConfig } from "@/config/city";
import Link from "next/link";
import Fuse from "fuse.js";
import styles from "../page.module.css";
import BusinessCardImage from "@/components/BusinessCardImage/BusinessCardImage";

type Business = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  rating: number;
  discount_label?: string | null;
  categories?: { name: string };
};

function normalize(str: string) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export default function SearchClient({ initialQuery }: { initialQuery: string }) {
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/businesses")
      .then((r) => r.json())
      .then((data) => { setAllBusinesses(data); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!initialQuery || allBusinesses.length === 0) { setResults([]); return; }

    const normalized = allBusinesses.map((b) => ({
      ...b,
      _name: normalize(b.name),
      _description: normalize(b.description ?? ""),
      _category: normalize(b.categories?.name ?? ""),
    }));

    const fuse = new Fuse(normalized, {
      keys: [
        { name: "_name", weight: 0.6 },
        { name: "_description", weight: 0.25 },
        { name: "_category", weight: 0.15 },
      ],
      threshold: 0.45,
      distance: 100,
    });

    setResults(fuse.search(normalize(initialQuery)).map((h) => h.item));
  }, [initialQuery, allBusinesses]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8rem 0" }}>
      <Loader2 size={32} style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="section">
      <div className="container">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
          <ArrowLeft size={18} /> Voltar
        </Link>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          {initialQuery
            ? <>Resultados para <span className="gradient-text">"{initialQuery}"</span></>
            : "Busca"}
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2.5rem", fontSize: "0.9rem" }}>
          {results.length} estabelecimento{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
        </p>

        {results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--text-muted)" }}>
            <SearchX size={48} style={{ margin: "0 auto 1rem", opacity: 0.4, display: "block" }} />
            <p>Nenhum resultado para <strong>"{initialQuery}"</strong>.</p>
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Tente outra palavra ou explore as categorias.</p>
            <Link href="/categories" className="gradient-text" style={{ fontWeight: 700, marginTop: "1.5rem", display: "inline-block" }}>
              Ver categorias →
            </Link>
          </div>
        ) : (
          <div className={styles.featuredGrid}>
            {results.map((biz, i) => (
              <Link
                href={`/business/${biz.slug}`}
                key={biz.id}
                className={`${styles.featuredCard} glass-card animate-fade`}
                style={{ animationDelay: `${i * 0.05}s`, position: "relative" }}
              >
                {biz.discount_label && (
                  <span className={styles.discountBadge}>{biz.discount_label}</span>
                )}
                <BusinessCardImage url={biz.image_url} name={biz.name} />
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{biz.name}</h3>
                    <div className={styles.cardRating}>
                      <Star size={14} fill="currentColor" />
                      <span>{Number(biz.rating).toFixed(1)}</span>
                    </div>
                  </div>
                  <p className={styles.cardDesc}>{biz.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardTag}>{biz.categories?.name}</span>
                    <span className={styles.cardLocation}><MapPin size={12} /> {cityConfig.name}</span>
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

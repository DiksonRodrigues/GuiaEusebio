"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Star, ArrowLeft, SearchX, Loader2, Search, X } from "lucide-react";
import { cityConfig } from "@/config/city";
import Link from "next/link";
import Fuse from "fuse.js";
import styles from "../page.module.css";
import filterStyles from "./SearchFilters.module.css";
import BusinessCardImage from "@/components/BusinessCardImage/BusinessCardImage";

type Business = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  rating: number;
  discount_label?: string | null;
  categories?: { name: string } | null;
  neighborhoods?: { name: string; slug: string } | null;
};

function normalize(str: string) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export default function SearchClient({ initialQuery }: { initialQuery: string }) {
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeNeighborhood, setActiveNeighborhood] = useState("");

  useEffect(() => {
    fetch("/api/businesses?limit=48")
      .then((r) => r.json())
      .then((data) => { setAllBusinesses(data); setLoading(false); });
  }, []);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const b of allBusinesses) {
      const name = b.categories?.name;
      if (name && !seen.has(name)) { seen.add(name); out.push(name); }
    }
    return out.sort();
  }, [allBusinesses]);

  const neighborhoods = useMemo(() => {
    const seen = new Set<string>();
    const out: { name: string; slug: string }[] = [];
    for (const b of allBusinesses) {
      const n = b.neighborhoods;
      if (n && !seen.has(n.slug)) { seen.add(n.slug); out.push(n); }
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }, [allBusinesses]);

  const results = useMemo(() => {
    let pool = allBusinesses;

    if (activeCategory) {
      pool = pool.filter((b) => b.categories?.name === activeCategory);
    }
    if (activeNeighborhood) {
      pool = pool.filter((b) => b.neighborhoods?.slug === activeNeighborhood);
    }

    if (!query.trim()) return pool;

    const normalized = pool.map((b) => ({
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

    return fuse.search(normalize(query)).map((h) => h.item);
  }, [query, activeCategory, activeNeighborhood, allBusinesses]);

  const hasFilters = !!activeCategory || !!activeNeighborhood;

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

        {/* Search input */}
        <div className={filterStyles.searchBox}>
          <Search size={18} className={filterStyles.searchIcon} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar estabelecimentos…"
            className={filterStyles.searchInput}
            autoFocus={!initialQuery}
          />
          {query && (
            <button onClick={() => setQuery("")} className={filterStyles.clearBtn} aria-label="Limpar busca">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className={filterStyles.filterRow}>
            <span className={filterStyles.filterLabel}>Categoria:</span>
            <div className={filterStyles.chips}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
                  className={`${filterStyles.chip} ${activeCategory === cat ? filterStyles.chipActive : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Neighborhood chips */}
        {neighborhoods.length > 0 && (
          <div className={filterStyles.filterRow}>
            <span className={filterStyles.filterLabel}>Bairro:</span>
            <div className={filterStyles.chips}>
              {neighborhoods.map((n) => (
                <button
                  key={n.slug}
                  onClick={() => setActiveNeighborhood(activeNeighborhood === n.slug ? "" : n.slug)}
                  className={`${filterStyles.chip} ${activeNeighborhood === n.slug ? filterStyles.chipActive : ""}`}
                >
                  {n.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear all filters */}
        {hasFilters && (
          <button
            onClick={() => { setActiveCategory(""); setActiveNeighborhood(""); }}
            className={filterStyles.clearFilters}
          >
            <X size={13} /> Limpar filtros
          </button>
        )}

        {/* Header */}
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "1.5rem 0 0.5rem" }}>
          {query
            ? <>Resultados para <span className="gradient-text">"{query}"</span></>
            : hasFilters ? "Filtros aplicados" : "Todos os estabelecimentos"}
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2.5rem", fontSize: "0.9rem" }}>
          {results.length} estabelecimento{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
        </p>

        {results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--text-muted)" }}>
            <SearchX size={48} style={{ margin: "0 auto 1rem", opacity: 0.4, display: "block" }} />
            <p>Nenhum resultado encontrado.</p>
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>Tente outro termo ou remova os filtros.</p>
            {hasFilters && (
              <button
                onClick={() => { setActiveCategory(""); setActiveNeighborhood(""); }}
                className={filterStyles.clearFilters}
                style={{ margin: "1.5rem auto 0", display: "inline-flex" }}
              >
                <X size={13} /> Limpar filtros
              </button>
            )}
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

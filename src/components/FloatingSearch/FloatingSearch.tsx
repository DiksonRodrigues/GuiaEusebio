"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import styles from "./FloatingSearch.module.css";
import { track } from "@/lib/track";

export default function FloatingSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setQuery(""); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = () => {
    const q = query.trim();
    if (!q) return;
    track("search", { metadata: { query: q } });
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <button
        id="floating-search-btn"
        className={styles.fab}
        onClick={() => setOpen(true)}
        aria-label="Abrir busca"
      >
        <Search size={22} />
      </button>

      {open && (
        <>
          <div className={styles.overlay} onClick={() => { setOpen(false); setQuery(""); }} />
          <div className={styles.modal}>
            <div className={styles.searchBar}>
              <Search size={20} className={styles.searchIcon} />
              <input
                ref={inputRef}
                id="floating-search-input"
                type="text"
                placeholder="Buscar estabelecimento ou categoria..."
                className={styles.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              <button
                className={styles.closeBtn}
                onClick={() => { setOpen(false); setQuery(""); }}
                aria-label="Fechar busca"
              >
                <X size={20} />
              </button>
            </div>
            <p className={styles.hint}>
              Pressione <kbd>Enter</kbd> para buscar · <kbd>ESC</kbd> para fechar
            </p>
          </div>
        </>
      )}
    </>
  );
}

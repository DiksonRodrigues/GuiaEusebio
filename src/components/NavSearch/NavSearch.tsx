"use client";

import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./NavSearch.module.css";

export default function NavSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <Search size={16} className={styles.icon} />
      <input
        type="text"
        placeholder="Buscar estabelecimento..."
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar"
      />
    </form>
  );
}

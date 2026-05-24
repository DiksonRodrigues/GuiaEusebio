"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import styles from "./FlyerViewer.module.css";

export default function FlyerViewer({ pages }: { pages: string[] }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : pages.length - 1)), [pages.length]);
  const next = useCallback(() => setCurrent((c) => (c < pages.length - 1 ? c + 1 : 0)), [pages.length]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  if (!pages.length) return null;

  return (
    <>
      <div className={styles.viewer}>
        <div className={styles.imageWrap} onClick={() => setLightbox(true)}>
          <img src={pages[current]} alt={`Página ${current + 1}`} className={styles.page} />
          <div className={styles.zoomHint}><ZoomIn size={18} /> Clique para ampliar</div>
        </div>

        {pages.length > 1 && (
          <>
            <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev} aria-label="Página anterior">
              <ChevronLeft size={24} />
            </button>
            <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next} aria-label="Próxima página">
              <ChevronRight size={24} />
            </button>

            <div className={styles.counter}>
              {current + 1} / {pages.length}
            </div>

            <div className={styles.dots}>
              {pages.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Página ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(false)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(false)}>
            <X size={24} />
          </button>
          <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft size={32} />
          </button>
          <img
            src={pages[current]}
            alt={`Página ${current + 1}`}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight size={32} />
          </button>
          <div className={styles.lightboxCounter}>{current + 1} / {pages.length}</div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import styles from "./CookieConsent.module.css";

const STORAGE_KEY = "cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Aviso de cookies">
      <p className={styles.text}>
        Usamos cookies para melhorar sua experiência e analisar o tráfego do site, conforme nossa{" "}
        <a href="/privacidade" className={styles.link}>Política de Privacidade</a>.
      </p>
      <div className={styles.actions}>
        <button onClick={decline} className={styles.btnDecline}>Recusar</button>
        <button onClick={accept} className={styles.btnAccept}>Aceitar</button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Scissors, Copy, Check, MessageCircle, Tag } from "lucide-react";
import styles from "./BusinessCoupons.module.css";
import { track } from "@/lib/track";

type Coupon = {
  id: string;
  code: string;
  discount_label: string;
  description: string | null;
  expires_at: string | null;
  redemption_count?: number;
};

type Props = {
  coupons: Coupon[];
  businessWhatsapp: string | null;
  businessName: string;
};

function formatExpiry(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function daysRemaining(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function CouponCard({ coupon, whatsapp, businessName }: { coupon: Coupon; whatsapp: string | null; businessName: string }) {
  const today = new Date().toISOString().split("T")[0];
  const storageKey = `coupon_redeemed_${coupon.id}_${today}`;
  const [copied, setCopied] = useState(false);
  const [redeemed, setRedeemed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(storageKey) === "true";
  });

  function handleCopy() {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRedeem() {
    localStorage.setItem(storageKey, "true");
    setRedeemed(true);
    track("coupon_redeem", {
      coupon_id: coupon.id,
      metadata: { utm_source: "guiaeusebio", utm_medium: "coupon", utm_campaign: coupon.code },
    });
    if (whatsapp) {
      const phone = whatsapp.replace(/\D/g, "");
      const msg = encodeURIComponent(
        `Olá! Vim pelo GuiaEusébio e quero usar o cupom *${coupon.code}* — ${coupon.discount_label} 😊`
      );
      window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
    }
  }

  const days = coupon.expires_at ? daysRemaining(coupon.expires_at) : null;
  const urgencyLabel =
    days !== null && days <= 7
      ? days <= 0 ? "Vence hoje!" : days === 1 ? "Vence amanhã!" : `Vence em ${days} dias!`
      : null;

  return (
    <div className={`${styles.coupon} ${redeemed ? styles.couponRedeemed : ""}`}>
      <div className={styles.couponLeft}>
        <span className={styles.label}>{coupon.discount_label}</span>
        {coupon.description && <p className={styles.desc}>{coupon.description}</p>}
        <div className={styles.metaRow}>
          {urgencyLabel && (
            <span className={`${styles.urgency} ${days !== null && days <= 3 ? styles.urgencyCritical : styles.urgencyWarn}`}>
              {urgencyLabel}
            </span>
          )}
          {!urgencyLabel && coupon.expires_at && (
            <span className={styles.expiry}>Válido até {formatExpiry(coupon.expires_at)}</span>
          )}
          {(coupon.redemption_count ?? 0) > 0 && (
            <span className={styles.redemptionCount}>
              🔥 {coupon.redemption_count} resgate{coupon.redemption_count !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className={styles.divider}>
        <div className={styles.notch} />
        <div className={styles.notch} />
      </div>

      <div className={styles.couponRight}>
        {redeemed && <span className={styles.redeemedBadge}>Resgatado hoje</span>}
        <div className={styles.codeBox}>
          <span className={styles.code}>{coupon.code}</span>
          <button onClick={handleCopy} className={styles.copyBtn} title="Copiar código">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <button
          onClick={handleRedeem}
          disabled={redeemed}
          className={`${styles.redeemBtn} ${redeemed ? styles.redeemBtnUsed : ""}`}
        >
          <MessageCircle size={14} />
          {redeemed ? "Já resgatado" : "Resgatar no WhatsApp"}
        </button>
      </div>
    </div>
  );
}

export default function BusinessCoupons({ coupons, businessWhatsapp, businessName }: Props) {
  if (!coupons.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <Scissors size={18} className={styles.scissors} />
        <h2 className={styles.title}>Cupons de Desconto</h2>
        <Tag size={14} className={styles.tag} />
      </div>
      <p className={styles.subtitle}>Copie o código e apresente via WhatsApp</p>
      <div className={styles.list}>
        {coupons.map((c) => (
          <CouponCard key={c.id} coupon={c} whatsapp={businessWhatsapp} businessName={businessName} />
        ))}
      </div>
    </section>
  );
}

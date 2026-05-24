import Image from "next/image";
import styles from "./BusinessCardImage.module.css";

const GRADIENTS = [
  ["#5b21b6", "#7c3aed"],
  ["#0ea5e9", "#0284c7"],
  ["#f97316", "#ea580c"],
  ["#16a34a", "#15803d"],
  ["#db2777", "#be185d"],
  ["#7c3aed", "#6d28d9"],
  ["#0891b2", "#0e7490"],
  ["#d97706", "#b45309"],
];

function pickGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function BusinessCardImage({
  url,
  name,
}: {
  url?: string | null;
  name: string;
}) {
  if (url) {
    return (
      <div className={styles.imageWrap}>
        <Image
          src={url}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className={styles.image}
        />
      </div>
    );
  }

  const [from, to] = pickGradient(name);

  return (
    <div
      className={styles.placeholder}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
      aria-label={name}
    >
      <span className={styles.initials}>{initials(name)}</span>
      <span className={styles.nameLabel}>{name}</span>
    </div>
  );
}

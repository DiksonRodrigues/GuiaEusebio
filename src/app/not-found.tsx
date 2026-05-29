import Link from "next/link";
import { MapPin, Home, Search } from "lucide-react";
import { cityConfig } from "@/config/city";

export const metadata = {
  title: `Página não encontrada — ${cityConfig.appTitle}`,
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        textAlign: "center",
        maxWidth: "480px",
        width: "100%",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "80px",
          height: "80px",
          borderRadius: "24px",
          background: "rgba(91, 33, 182, 0.08)",
          color: "var(--primary)",
          marginBottom: "1.5rem",
        }}>
          <MapPin size={36} />
        </div>

        <p style={{
          fontSize: "5rem",
          fontWeight: 800,
          lineHeight: 1,
          color: "var(--primary)",
          letterSpacing: "-2px",
          marginBottom: "0.5rem",
        }}>
          404
        </p>

        <h1 style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--text-main)",
          marginBottom: "0.75rem",
        }}>
          Página não encontrada
        </h1>

        <p style={{
          fontSize: "1rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: "2rem",
        }}>
          O endereço que você digitou não existe no {cityConfig.appTitle}.
          Talvez o link esteja desatualizado ou a página tenha sido removida.
        </p>

        <div style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--primary)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "0.7rem 1.4rem",
              borderRadius: "var(--radius-md)",
              transition: "opacity 0.2s",
            }}
          >
            <Home size={16} />
            Início
          </Link>

          <Link
            href="/search"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(91, 33, 182, 0.08)",
              color: "var(--primary)",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "0.7rem 1.4rem",
              borderRadius: "var(--radius-md)",
              transition: "opacity 0.2s",
            }}
          >
            <Search size={16} />
            Buscar negócios
          </Link>
        </div>
      </div>
    </div>
  );
}

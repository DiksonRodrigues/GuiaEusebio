import { MapPin, Building2 } from "lucide-react";
import { cityConfig } from "@/config/city";
import { getNeighborhoodsWithCount } from "@/lib/database";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Bairros — ${cityConfig.appTitle}`,
  description: `Explore negócios e estabelecimentos por bairro em ${cityConfig.name}, ${cityConfig.state}.`,
};

export default async function BairrosPage() {
  const neighborhoods = await getNeighborhoodsWithCount().catch(() => []);
  const sorted = [...neighborhoods].sort((a: any, b: any) => b.business_count - a.business_count);

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Bairros de <span className="gradient-text">{cityConfig.name}</span>
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Encontre negócios perto de você, por bairro.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {sorted.map((n: any) => (
            <Link
              key={n.id}
              href={`/bairros/${n.slug}`}
              className="glass-card animate-fade"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.25rem 1.5rem",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.2s",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(91,33,182,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MapPin size={18} color="var(--primary)" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.15rem" }}>
                  {n.name}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Building2 size={12} />
                  {n.business_count} negócio{n.business_count !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {sorted.length === 0 && (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "4rem 0" }}>
            Nenhum bairro cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}

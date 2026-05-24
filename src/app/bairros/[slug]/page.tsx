import { MapPin, Star, ArrowLeft } from "lucide-react";
import { cityConfig } from "@/config/city";
import { getBusinessesByNeighborhood } from "@/lib/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../page.module.css";
import type { Metadata } from "next";
import BusinessCardImage from "@/components/BusinessCardImage/BusinessCardImage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { neighborhood } = await getBusinessesByNeighborhood(slug);
    return {
      title: `Negócios em ${neighborhood.name} — ${cityConfig.appTitle}`,
      description: `Encontre os melhores estabelecimentos no bairro ${neighborhood.name} em ${cityConfig.name}, ${cityConfig.state}.`,
      openGraph: {
        title: `Negócios em ${neighborhood.name} — ${cityConfig.appTitle}`,
        description: `Estabelecimentos no bairro ${neighborhood.name}, ${cityConfig.name}.`,
      },
    };
  } catch {
    return {};
  }
}

export default async function BairroPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let result;
  try {
    result = await getBusinessesByNeighborhood(slug);
  } catch {
    return notFound();
  }

  const { neighborhood, businesses } = result;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Negócios em ${neighborhood.name} — ${cityConfig.appTitle}`,
    description: `Estabelecimentos no bairro ${neighborhood.name}, ${cityConfig.name}`,
    numberOfItems: businesses.length,
    itemListElement: businesses.map((biz: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: biz.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: neighborhood.name,
          addressRegion: cityConfig.state,
          addressCountry: "BR",
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/business/${biz.slug}`,
      },
    })),
  };

  return (
    <div className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container">
        <Link
          href="/bairros"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "2rem" }}
        >
          <ArrowLeft size={20} /> Todos os bairros
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <MapPin size={28} color="var(--primary)" />
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>
            <span className="gradient-text">{neighborhood.name}</span>
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "3rem" }}>
          {businesses.length} estabelecimento{businesses.length !== 1 ? "s" : ""} em{" "}
          {neighborhood.name}, {cityConfig.name}.
        </p>

        <div className={styles.featuredGrid}>
          {businesses.map((biz: any, i: number) => (
            <Link
              href={`/business/${biz.slug}`}
              key={biz.id}
              className={`${styles.featuredCard} glass-card animate-fade`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
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
                  <span className={styles.cardLocation}>
                    <MapPin size={12} /> {neighborhood.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {businesses.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ color: "var(--text-muted)" }}>
              Nenhum estabelecimento cadastrado neste bairro ainda.
            </p>
            <Link href="/bairros" className="gradient-text" style={{ fontWeight: 600, marginTop: "1rem", display: "inline-block" }}>
              Ver outros bairros
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

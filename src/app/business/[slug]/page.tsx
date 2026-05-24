import {
  MapPin,
  Phone,
  Clock,
  Globe,
  Star,
  ExternalLink,
  Share2,
  Info,
  Calendar,
  ArrowLeft,
  ShoppingBag
} from "lucide-react";
import Image from "next/image";
import { cityConfig } from "@/config/city";
import { getBusinessBySlug } from "@/lib/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./business.module.css";
import BusinessTracker from "@/components/BusinessTracker/BusinessTracker";
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";

export default async function BusinessDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let business;
  try {
    business = await getBusinessBySlug(slug);
  } catch (e) {
    return notFound();
  }

  if (!business) {
    return notFound();
  }

  return (
    <div className={styles.businessPage}>
      <BusinessTracker businessId={business.id} />

      {/* Navigation Bar */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={20} /> Voltar para o início
        </Link>
      </div>

      {/* Hero Banner */}
      <div className={styles.hero}>
        <div className={styles.heroImage}>
          {business.image_url && (
            <Image
              src={business.image_url}
              alt={business.name}
              fill
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          )}
          <div className={styles.heroGradient} />
        </div>
      </div>

      <div className="container">
        {/* Header Info */}
        <header className={`${styles.headerContent} glass-card`}>
          <div className={styles.mainInfo}>
            <div className={styles.titleArea}>
              <span className={styles.tag}>{business.categories?.name}</span>
              <h1>{business.name}</h1>
              <div className={styles.meta}>
                <div className={styles.rating}>
                  <Star size={18} fill="currentColor" />
                  <span>{Number(business.rating).toFixed(1)}</span>
                </div>
                <span>({business.reviews_count} avaliações)</span>
                <span className={styles.location}>
                  <MapPin size={16} /> {cityConfig.name}
                </span>
              </div>
            </div>
            
            <div className={styles.actions}>
              <WhatsAppButton
                whatsapp={business.whatsapp}
                businessId={business.id}
                className={`${styles.btn} ${styles.btnPrimary}`}
              />
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <section className={`${styles.card} glass-card animate-fade`}>
              <h2><Info size={20} /> Sobre o Estabelecimento</h2>
              <p className={styles.description}>{business.description}</p>
            </section>

            <section className={`${styles.card} glass-card animate-fade`} style={{ animationDelay: '0.1s' }}>
              <h2><ShoppingBag size={20} /> Produtos</h2>
              <div className={styles.productGrid}>
                {business.business_products?.map((prod: any, i: number) => (
                  <div key={i} className={styles.productCard}>
                    <div className={styles.productImage}>
                      <Image
                        src={prod.image_url || business.image_url}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{prod.name}</span>
                      <span className={styles.productPrice}>{prod.price}</span>
                    </div>
                  </div>
                ))}
                {business.business_products?.length === 0 && (
                  <p style={{ color: 'var(--text-muted)' }}>Nenhum produto listado ainda.</p>
                )}
              </div>
            </section>
          </div>

          <aside className={styles.sideColumn}>
            <section className={`${styles.card} glass-card animate-fade`} style={{ animationDelay: '0.2s' }}>
              <h2>Informações de Contato</h2>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <MapPin className={styles.infoIcon} size={20} />
                  <div>
                    <span className={styles.infoLabel}>Endereço</span>
                    <span className={styles.infoValue}>{business.address}</span>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <Phone className={styles.infoIcon} size={20} />
                  <div>
                    <span className={styles.infoLabel}>Telefone</span>
                    <span className={styles.infoValue}>{business.phone || "Não informado"}</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <Clock className={styles.infoIcon} size={20} />
                  <div>
                    <span className={styles.infoLabel}>Horário</span>
                    <span className={styles.infoValue}>{business.hours || "Consultar no local"}</span>
                  </div>
                </div>

                {business.website && (
                  <div className={styles.infoItem}>
                    <Globe className={styles.infoIcon} size={20} />
                    <div>
                      <span className={styles.infoLabel}>Website</span>
                      <span className={styles.infoValue}>
                        <a href={`http://${business.website}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
                          {business.website} <ExternalLink size={12} />
                        </a>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button className={`${styles.btn} ${styles.btnOutline}`} style={{ width: '100%', justifyContent: 'center' }}>
                  Ver no Mapa
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

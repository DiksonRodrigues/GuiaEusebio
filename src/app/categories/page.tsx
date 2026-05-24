import * as LucideIcons from "lucide-react";
import { getCategories } from "@/lib/database";
import Link from "next/link";
import styles from "../page.module.css";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="section">
      <div className="container">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <LucideIcons.ArrowLeft size={20} /> Voltar
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem' }}>Todas as Categorias</h1>
        
        <div className={styles.categoryGrid}>
          {categories.map((cat: any, i: number) => {
            // @ts-ignore
            const IconComponent = LucideIcons[cat.icon_name] || LucideIcons.HelpCircle;
            return (
              <Link 
                href={`/categories/${cat.slug}`} 
                key={cat.id} 
                className={`${styles.categoryItem} glass-card animate-fade`} 
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={styles.categoryIcon} style={{ color: cat.color }}>
                  <IconComponent size={24} />
                </div>
                <span className={styles.categoryName}>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

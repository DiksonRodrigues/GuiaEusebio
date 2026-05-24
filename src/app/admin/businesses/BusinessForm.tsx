"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/storage";
import styles from "../admin.module.css";

type Category = { id: string; name: string };
type Neighborhood = { id: string; name: string };
type Product = { id?: string; name: string; price: string; image_url: string; _file?: File };

type BusinessData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  hours: string;
  website: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  featured: boolean;
  discount_label: string;
  category_id: string;
  neighborhood_id: string;
  business_products?: Product[];
};

function toSlug(name: string) {
  return name.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");
}

const empty: BusinessData = {
  name: "", slug: "", description: "", address: "", phone: "",
  whatsapp: "", hours: "", website: "", image_url: "", rating: 4.5,
  reviews_count: 0, featured: false, discount_label: "", category_id: "",
  neighborhood_id: "",
};

export default function BusinessForm({
  categories,
  neighborhoods,
  initial,
}: {
  categories: Category[];
  neighborhoods: Neighborhood[];
  initial?: BusinessData;
}) {
  const isEdit = !!initial?.id;
  const router = useRouter();

  const [form, setForm] = useState<BusinessData>(initial ?? empty);
  const [products, setProducts] = useState<Product[]>(initial?.business_products ?? []);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const heroInputRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof BusinessData, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: f.slug || toSlug(name) }));
  };

  // ── Produto helpers ──────────────────────────────────────────
  const addProduct = () =>
    setProducts((p) => [...p, { name: "", price: "", image_url: "" }]);

  const setProduct = (i: number, k: keyof Product, v: any) =>
    setProducts((ps) => ps.map((p, idx) => idx === i ? { ...p, [k]: v } : p));

  const removeProduct = async (i: number) => {
    const prod = products[i];
    if (prod.id) {
      await fetch(`/api/admin/products/${prod.id}`, { method: "DELETE" });
    }
    setProducts((ps) => ps.filter((_, idx) => idx !== i));
  };

  // ── Upload image helper ─────────────────────────────────────
  const uploadProductImage = async (i: number, file: File) => {
    setProduct(i, "_file", file);
    const preview = URL.createObjectURL(file);
    setProduct(i, "image_url", preview);
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.category_id) {
      setError("Nome, slug e categoria são obrigatórios.");
      return;
    }
    if (!form.neighborhood_id) {
      setError("Selecione o bairro.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // 1. Upload hero image
      let image_url = form.image_url;
      if (heroFile) {
        image_url = await uploadImage(heroFile, "businesses");
      }

      // 2. Upsert business
      const payload = { ...form, image_url };
      delete (payload as any).business_products;

      let bizId = form.id;
      if (isEdit) {
        const res = await fetch(`/api/admin/businesses/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      } else {
        const res = await fetch("/api/admin/businesses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const data = await res.json();
        bizId = data.id;
      }

      // 3. Upsert products
      for (const prod of products) {
        let prodImageUrl = prod.image_url;

        // Upload product image if it's a new file (blob URL)
        if (prod._file) {
          prodImageUrl = await uploadImage(prod._file, "products");
        }

        const prodPayload = { name: prod.name, price: prod.price, image_url: prodImageUrl };

        if (prod.id) {
          await fetch(`/api/admin/products/${prod.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prodPayload),
          });
        } else {
          await fetch(`/api/admin/businesses/${bizId}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prodPayload),
          });
        }
      }

      router.push("/admin/businesses");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Informações do negócio ── */}
      <div className={styles.card}>
        <div className={styles.formGrid}>

          <div className={styles.field}>
            <label className={styles.label}>Nome *</label>
            <input className={styles.input} value={form.name}
              onChange={(e) => handleNameChange(e.target.value)} placeholder="Ex: Açaí do João" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Slug (URL) *</label>
            <input className={styles.input} value={form.slug}
              onChange={(e) => set("slug", e.target.value)} placeholder="acai-do-joao" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Categoria *</label>
            <select className={styles.select} value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}>
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Bairro *</label>
            <select className={styles.select} value={form.neighborhood_id}
              onChange={(e) => set("neighborhood_id", e.target.value)}>
              <option value="">Selecione...</option>
              {neighborhoods.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Desconto (ex: 20% OFF)</label>
            <input className={styles.input} value={form.discount_label}
              onChange={(e) => set("discount_label", e.target.value)} placeholder="20% OFF" />
          </div>

          <div className={`${styles.field} ${styles.formFull}`}>
            <label className={styles.label}>Descrição</label>
            <textarea className={styles.textarea} value={form.description}
              onChange={(e) => set("description", e.target.value)} placeholder="Descreva o estabelecimento..." />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Endereço</label>
            <input className={styles.input} value={form.address}
              onChange={(e) => set("address", e.target.value)} placeholder="Rua, número, bairro" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Telefone</label>
            <input className={styles.input} value={form.phone}
              onChange={(e) => set("phone", e.target.value)} placeholder="(85) 3333-4444" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>WhatsApp</label>
            <input className={styles.input} value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)} placeholder="5585999999999" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Horário de Funcionamento</label>
            <input className={styles.input} value={form.hours}
              onChange={(e) => set("hours", e.target.value)} placeholder="Seg–Sex 8h–18h" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Website</label>
            <input className={styles.input} value={form.website}
              onChange={(e) => set("website", e.target.value)} placeholder="meusite.com.br" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Avaliação (0–5)</label>
            <input className={styles.input} type="number" min={0} max={5} step={0.1}
              value={form.rating} onChange={(e) => set("rating", parseFloat(e.target.value))} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nº de Avaliações</label>
            <input className={styles.input} type="number" min={0}
              value={form.reviews_count} onChange={(e) => set("reviews_count", parseInt(e.target.value))} />
          </div>

          {/* ── Foto principal ── */}
          <div className={`${styles.field} ${styles.formFull}`}>
            <label className={styles.label}>Foto Principal</label>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <input className={styles.input} value={heroFile ? "(arquivo selecionado)" : form.image_url}
                  onChange={(e) => { setHeroFile(null); set("image_url", e.target.value); }}
                  placeholder="https://... ou use o botão ao lado" readOnly={!!heroFile} />
              </div>
              <button type="button" className={`${styles.btn} ${styles.btnOutline}`}
                onClick={() => heroInputRef.current?.click()}>
                <Upload size={15} /> Upload
              </button>
              <input ref={heroInputRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setHeroFile(f); set("image_url", URL.createObjectURL(f)); }
                }} />
            </div>
            {form.image_url && (
              <img src={form.image_url} alt="preview" className={styles.imagePreview} />
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.checkboxRow}>
              <input type="checkbox" checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)} />
              Destacar na página inicial
            </label>
          </div>

        </div>
      </div>

      {/* ── Produtos ── */}
      <div className={styles.card}>
        <div className={styles.productsSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className={styles.productsTitle}>
            <span>Produtos / Serviços</span>
            <button type="button" className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`} onClick={addProduct}>
              <Plus size={14} /> Adicionar
            </button>
          </div>

          {products.map((prod, i) => (
            <div key={i} className={styles.productRow}>
              <div className={styles.field}>
                <label className={styles.label}>Nome</label>
                <input className={styles.input} value={prod.name}
                  onChange={(e) => setProduct(i, "name", e.target.value)} placeholder="Nome do produto" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Preço</label>
                <input className={styles.input} value={prod.price}
                  onChange={(e) => setProduct(i, "price", e.target.value)} placeholder="R$ 0,00" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Imagem</label>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <input className={styles.input} value={prod._file ? "(arquivo)" : prod.image_url}
                    onChange={(e) => { setProduct(i, "_file", undefined); setProduct(i, "image_url", e.target.value); }}
                    placeholder="URL ou upload" readOnly={!!prod._file} style={{ minWidth: 0 }} />
                  <label className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                    <Upload size={12} />
                    <input type="file" accept="image/*" style={{ display: "none" }}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadProductImage(i, f); }} />
                  </label>
                </div>
                {prod.image_url && (
                  <img src={prod.image_url} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 6, marginTop: 4 }} />
                )}
              </div>
              <div style={{ paddingBottom: "0.1rem" }}>
                <button type="button" className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                  onClick={() => removeProduct(i)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Nenhum produto ainda. Clique em "Adicionar".</p>
          )}
        </div>
      </div>

      {/* ── Ações ── */}
      {error && <p style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</p>}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmit}
          disabled={loading}
          style={{ minWidth: 160, justifyContent: "center" }}
        >
          {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Salvando...</> : (isEdit ? "Salvar alterações" : "Criar negócio")}
        </button>
        <a href="/admin/businesses" className={`${styles.btn} ${styles.btnOutline}`}>Cancelar</a>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

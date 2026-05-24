"use client";

import { useState } from "react";
import { Building2, User, Phone, Mail, MapPin, CheckCircle, Send } from "lucide-react";
import { cityConfig } from "@/config/city";
import { createClient } from "@supabase/supabase-js";
import styles from "./advertise.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    company: "",
    responsible: "",
    whatsapp: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: dbError } = await supabase.from("leads").insert({
      company: form.company,
      responsible: form.responsible,
      whatsapp: form.whatsapp,
      email: form.email,
      address: form.address,
    });

    setLoading(false);

    if (dbError) {
      setError("Ocorreu um erro ao enviar. Tente novamente.");
      console.error(dbError);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={`${styles.successCard} glass-card`}>
          <CheckCircle size={64} className={styles.successIcon} />
          <h1>Solicitação Enviada!</h1>
          <p>
            Recebemos os dados de <strong>{form.company}</strong>. Nossa equipe
            entrará em contato pelo WhatsApp <strong>{form.whatsapp}</strong> em
            breve para finalizar o cadastro.
          </p>
          <a href="/" className={styles.backButton}>
            Voltar para o Início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>

          {/* ── Lado Esquerdo: Benefícios ── */}
          <aside className={styles.sidebar}>
            <h1 className={styles.sideTitle}>
              Coloque seu negócio no <span className="gradient-text">mapa</span>
            </h1>
            <p className={styles.sideSubtitle}>
              Milhares de moradores de {cityConfig.name} usam o Guia para encontrar
              serviços. Faça parte disso.
            </p>

            <ul className={styles.benefitList}>
              {[
                "Página exclusiva do seu estabelecimento",
                "Listagem de produtos com fotos e preços",
                "Botão de WhatsApp direto para o cliente",
                "Aparece nas categorias relevantes",
              ].map((b) => (
                <li key={b} className={styles.benefitItem}>
                  <CheckCircle size={18} className={styles.benefitIcon} />
                  {b}
                </li>
              ))}
            </ul>
          </aside>

          {/* ── Lado Direito: Formulário ── */}
          <div className={styles.formWrapper}>
            <div className={`${styles.formCard} glass-card`}>
              <h2 className={styles.formTitle}>Cadastrar meu Negócio</h2>
              <p className={styles.formSubtitle}>
                Preencha os dados abaixo e entraremos em contato.
              </p>

              <form onSubmit={handleSubmit} className={styles.form} noValidate>

                {/* Nome da Empresa */}
                <div className={styles.field}>
                  <label htmlFor="company" className={styles.label}>
                    <Building2 size={16} /> Nome da Empresa
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Ex: Açaí do João"
                    className={styles.input}
                    value={form.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Nome do Responsável */}
                <div className={styles.field}>
                  <label htmlFor="responsible" className={styles.label}>
                    <User size={16} /> Nome do Responsável
                  </label>
                  <input
                    id="responsible"
                    name="responsible"
                    type="text"
                    placeholder="Seu nome completo"
                    className={styles.input}
                    value={form.responsible}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* WhatsApp e Email lado a lado */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="whatsapp" className={styles.label}>
                      <Phone size={16} /> WhatsApp
                    </label>
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      placeholder="(85) 9 9999-9999"
                      className={styles.input}
                      value={form.whatsapp}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>
                      <Mail size={16} /> E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="contato@empresa.com"
                      className={styles.input}
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className={styles.field}>
                  <label htmlFor="address" className={styles.label}>
                    <MapPin size={16} /> Endereço do Local
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Rua, número, bairro"
                    className={styles.input}
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                  id="advertise-submit"
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar Solicitação
                    </>
                  )}
                </button>

                {error && (
                  <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem' }}>
                    {error}
                  </p>
                )}

                <p className={styles.disclaimer}>
                  Ao enviar, você concorda que nossa equipe entre em contato pelos
                  dados informados. Sem spam, prometemos. 🤝
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

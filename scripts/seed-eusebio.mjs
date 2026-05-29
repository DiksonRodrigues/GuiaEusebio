import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const U = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

// ─── helpers ────────────────────────────────────────────────────────────────

function ok(label, data, error) {
  if (error) { console.error(`✗ ${label}:`, error.message); return false; }
  console.log(`✓ ${label}`);
  return true;
}

async function sql(query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  return res.ok;
}

// ─── 1. Adicionar colunas icon_name e color em categories ───────────────────

console.log("\n── Atualizando schema de categorias ──");

// Colunas icon_name/color adicionadas via Supabase SQL Editor manualmente se necessário.
// O update via .update() abaixo tentará de qualquer forma — silently fails se coluna não existir.
console.log("  (colunas icon_name/color serão adicionadas via update — veja aviso final se falhar)");

// ─── 2. Atualizar categorias com ícones e cores ──────────────────────────────

console.log("\n── Atualizando categorias com ícones/cores ──");

const categoryMeta = [
  { slug: "alimentacao",    icon_name: "Utensils",      color: "#ef4444" },
  { slug: "supermercados",  icon_name: "ShoppingCart",  color: "#10b981" },
  { slug: "farmacias",      icon_name: "Pill",          color: "#3b82f6" },
  { slug: "beleza-estetica",icon_name: "Sparkles",      color: "#ec4899" },
  { slug: "saude",          icon_name: "Heart",         color: "#f43f5e" },
  { slug: "educacao",       icon_name: "BookOpen",      color: "#8b5cf6" },
  { slug: "servicos",       icon_name: "Wrench",        color: "#f59e0b" },
  { slug: "lojas-comercio", icon_name: "Store",         color: "#6366f1" },
  { slug: "automotivo",     icon_name: "Car",           color: "#64748b" },
  { slug: "lazer-esporte",  icon_name: "Dumbbell",      color: "#0ea5e9" },
];

for (const cat of categoryMeta) {
  const { error } = await supabase
    .from("categories")
    .update({ icon_name: cat.icon_name, color: cat.color })
    .eq("slug", cat.slug);
  if (error) {
    console.error(`  ✗ categoria ${cat.slug}: ${error.message}`);
    console.error("  → Rode a migration 005_categories_icon_color.sql no Supabase antes do seed.");
  }
}
console.log("✓ Categorias atualizadas");

// ─── 3. Buscar IDs de categorias e bairros ───────────────────────────────────

const { data: cats } = await supabase.from("categories").select("id, slug");
const catId = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

const { data: hoods } = await supabase.from("neighborhoods").select("id, slug, name");
const hoodId = Object.fromEntries(hoods.map((h) => [h.slug, h.id]));
const hoodIds = hoods.map((h) => h.id);
const rndHood = () => hoodIds[Math.floor(Math.random() * hoodIds.length)];

// ─── 4. Estabelecimentos ─────────────────────────────────────────────────────

console.log("\n── Inserindo estabelecimentos ──");

const BUSINESSES = [
  // ALIMENTAÇÃO
  {
    name: "Restaurante Sabor do Ceará",
    slug: "restaurante-sabor-do-ceara",
    description: "Culinária cearense autêntica com pratos típicos, carne de sol e baião de dois fresquinhos todo dia.",
    address: "Rua das Flores, 120 — Centro, Eusébio",
    phone: "(85) 3261-1001",
    whatsapp: "5585932611001",
    hours: "Seg–Sáb 11h–15h / 18h–22h | Dom 11h–16h",
    image_url: U("photo-1555396273-367ea4eb4db5", 800, 600),
    rating: 4.8, reviews_count: 312, featured: true,
    discount_label: "10% no almoço",
    category_id: catId["alimentacao"],
    neighborhood_id: hoodId["centro"] ?? rndHood(),
  },
  {
    name: "Pizzaria Bella Napoli",
    slug: "pizzaria-bella-napoli",
    description: "As melhores pizzas artesanais de Eusébio, massa fina, ingredientes frescos e fornos a lenha.",
    address: "Av. Eusébio de Queirós, 890 — Precabura",
    phone: "(85) 3261-2020",
    whatsapp: "5585932612020",
    hours: "Ter–Dom 18h–23h",
    image_url: U("photo-1513104890138-7c749659a591", 800, 600),
    rating: 4.7, reviews_count: 198, featured: true,
    discount_label: "Pizza G no dobro",
    category_id: catId["alimentacao"],
    neighborhood_id: hoodId["precabura"] ?? rndHood(),
  },
  {
    name: "Padaria & Confeitaria Doce Pão",
    slug: "padaria-doce-pao",
    description: "Pão fresquinho saindo do forno toda manhã. Bolos, salgados, café e muito mais.",
    address: "Rua Coronel Linhares, 45 — Cararu",
    phone: "(85) 3261-3030",
    whatsapp: "5585932613030",
    hours: "Seg–Dom 06h–20h",
    image_url: U("photo-1509440159596-0249088772ff", 800, 600),
    rating: 4.6, reviews_count: 145, featured: false,
    discount_label: "Café da manhã completo R$15",
    category_id: catId["alimentacao"],
    neighborhood_id: hoodId["cararu"] ?? rndHood(),
  },
  {
    name: "Açaí da Vila",
    slug: "acai-da-vila",
    description: "Açaí cremoso, fresco e natural com mais de 30 complementos. A pedida certa para o seu dia.",
    address: "Praça da Amizade, 10 — Cidade Alpha",
    phone: "(85) 9 8801-4040",
    whatsapp: "5585988014040",
    hours: "Seg–Dom 13h–22h",
    image_url: U("photo-1590301157890-4810ed352733", 800, 600),
    rating: 4.9, reviews_count: 422, featured: true,
    discount_label: "Copo G por R$18",
    category_id: catId["alimentacao"],
    neighborhood_id: hoodId["cidade-alpha"] ?? rndHood(),
  },
  {
    name: "Lanchonete Ponto X",
    slug: "lanchonete-ponto-x",
    description: "Hambúrgueres artesanais, hot dogs e porções generosas. O point do bairro.",
    address: "Av. Laurentino Monteiro, 330 — Tamatanduba",
    phone: "(85) 9 9712-5050",
    whatsapp: "5585997125050",
    hours: "Seg–Sáb 17h–23h30",
    image_url: U("photo-1568901346375-23c9450c58cd", 800, 600),
    rating: 4.5, reviews_count: 87, featured: false,
    discount_label: "X-Tudo + refri R$22",
    category_id: catId["alimentacao"],
    neighborhood_id: hoodId["tamatanduba"] ?? rndHood(),
  },
  // FARMÁCIAS
  {
    name: "Farmácia Saúde Total",
    slug: "farmacia-saude-total",
    description: "Medicamentos, cosméticos, dermocosméticos e produtos de saúde com os melhores preços da região.",
    address: "Av. Eusébio de Queirós, 1240 — Centro",
    phone: "(85) 3261-6060",
    whatsapp: "5585932616060",
    hours: "Seg–Sáb 07h–22h | Dom 08h–20h",
    image_url: U("photo-1576602976047-174e57a47881", 800, 600),
    rating: 4.7, reviews_count: 256, featured: true,
    discount_label: "20% em genéricos",
    category_id: catId["farmacias"],
    neighborhood_id: hoodId["centro"] ?? rndHood(),
  },
  {
    name: "Drogaria Popular Eusébio",
    slug: "drogaria-popular-eusebio",
    description: "Medicamentos com preço popular, entrega em domicílio e farmacêutico de plantão.",
    address: "Rua Maria Tomásia, 88 — Precabura",
    phone: "(85) 3261-7070",
    whatsapp: "5585932617070",
    hours: "24 horas, todos os dias",
    image_url: U("photo-1584308666744-24d5c474f2ae", 800, 600),
    rating: 4.4, reviews_count: 134, featured: false,
    discount_label: "Fidelidade: 5% toda compra",
    category_id: catId["farmacias"],
    neighborhood_id: hoodId["precabura"] ?? rndHood(),
  },
  // BELEZA & ESTÉTICA
  {
    name: "Salão Bella Arte",
    slug: "salao-bella-arte",
    description: "Cortes, coloração, escova, manicure e pedicure. Beleza completa em um só lugar.",
    address: "Rua das Acacias, 67 — Santa Clara",
    phone: "(85) 9 8802-8080",
    whatsapp: "5585988028080",
    hours: "Seg–Sáb 09h–19h",
    image_url: U("photo-1560066984-138dadb4c035", 800, 600),
    rating: 4.8, reviews_count: 289, featured: true,
    discount_label: "Escova + hidratação R$65",
    category_id: catId["beleza-estetica"],
    neighborhood_id: hoodId["santa-clara"] ?? rndHood(),
  },
  {
    name: "Barbearia Style's",
    slug: "barbearia-styles",
    description: "Corte masculino, barba, hidratação e sobrancelha. Ambiente premium, atendimento por hora marcada.",
    address: "Shopping Eusébio, Sala 12 — Mangabeira",
    phone: "(85) 9 9803-9090",
    whatsapp: "5585998039090",
    hours: "Seg–Sáb 09h–20h | Dom 10h–16h",
    image_url: U("photo-1503951914875-452162b0f3f1", 800, 600),
    rating: 4.9, reviews_count: 367, featured: true,
    discount_label: "Corte + barba R$45",
    category_id: catId["beleza-estetica"],
    neighborhood_id: hoodId["mangabeira"] ?? rndHood(),
  },
  {
    name: "Studio Sobrancelhas Design",
    slug: "studio-sobrancelhas-design",
    description: "Design de sobrancelhas, micropigmentação, lash lifting e extensão de cílios.",
    address: "Rua das Palmeiras, 22 — Jabuti",
    phone: "(85) 9 9700-1010",
    whatsapp: "5585997001010",
    hours: "Seg–Sáb 09h–19h",
    image_url: U("photo-1522337360788-8b13dee7a37e", 800, 600),
    rating: 4.7, reviews_count: 178, featured: false,
    discount_label: "Design + henna R$55",
    category_id: catId["beleza-estetica"],
    neighborhood_id: hoodId["jabuti"] ?? rndHood(),
  },
  // SAÚDE
  {
    name: "Clínica Médica Eusébio",
    slug: "clinica-medica-eusebio",
    description: "Clínica geral, cardiologia, ortopedia e pediatria. Exames laboratoriais e de imagem no local.",
    address: "Av. Eusébio de Queirós, 2100 — Lagoinha",
    phone: "(85) 3261-1100",
    whatsapp: "5585932611100",
    hours: "Seg–Sex 07h–18h | Sáb 08h–13h",
    image_url: U("photo-1538108149393-fbbd81895907", 800, 600),
    rating: 4.6, reviews_count: 198, featured: false,
    discount_label: "Consulta particular R$120",
    category_id: catId["saude"],
    neighborhood_id: hoodId["lagoinha"] ?? rndHood(),
  },
  {
    name: "Fisio & Vida Reabilitação",
    slug: "fisio-e-vida-reabilitacao",
    description: "Fisioterapia ortopédica, neurológica, pré e pós-cirúrgica. RPG, pilates clínico e acupuntura.",
    address: "Rua Pires Façanha, 340 — Pires Façanha",
    phone: "(85) 9 8811-1200",
    whatsapp: "5585988111200",
    hours: "Seg–Sex 07h–19h | Sáb 08h–12h",
    image_url: U("photo-1559757148-5c350d0d3c56", 800, 600),
    rating: 4.8, reviews_count: 143, featured: false,
    discount_label: "1ª sessão avaliação grátis",
    category_id: catId["saude"],
    neighborhood_id: hoodId["pires-facanha"] ?? rndHood(),
  },
  // LOJAS & COMÉRCIO
  {
    name: "Ótica Visão Clara",
    slug: "otica-visao-clara",
    description: "Óculos de grau, sol e lentes de contato. Exame de vista gratuito. As melhores marcas da região.",
    address: "Rua Principal, 500 — Centro",
    phone: "(85) 3261-3300",
    whatsapp: "5585932613300",
    hours: "Seg–Sáb 08h30–18h30",
    image_url: U("photo-1574258495973-f010dfbb5371", 800, 600),
    rating: 4.6, reviews_count: 112, featured: false,
    discount_label: "2ª armação 50% off",
    category_id: catId["lojas-comercio"],
    neighborhood_id: hoodId["centro"] ?? rndHood(),
  },
  {
    name: "Magazine Moda & Cia",
    slug: "magazine-moda-e-cia",
    description: "Roupas femininas, masculinas e infantis. Moda atual com o preço que cabe no bolso.",
    address: "Av. Eusébio de Queirós, 1550 — Encantada",
    phone: "(85) 9 8822-3400",
    whatsapp: "5585988223400",
    hours: "Seg–Sáb 09h–19h | Dom 10h–15h",
    image_url: U("photo-1441986300917-64674bd600d8", 800, 600),
    rating: 4.3, reviews_count: 89, featured: false,
    discount_label: "3 peças por R$99",
    category_id: catId["lojas-comercio"],
    neighborhood_id: hoodId["encantada"] ?? rndHood(),
  },
  {
    name: "Papelaria & Informática Central",
    slug: "papelaria-informatica-central",
    description: "Material escolar, informática, impressões, encadernações e material de escritório.",
    address: "Praça da Liberdade, 15 — Urucunema",
    phone: "(85) 3261-4400",
    whatsapp: "5585932614400",
    hours: "Seg–Sex 07h30–18h | Sáb 08h–14h",
    image_url: U("photo-1456735190827-d1262f71b8a3", 800, 600),
    rating: 4.4, reviews_count: 67, featured: false,
    discount_label: "Impressão 10 cópias R$2",
    category_id: catId["lojas-comercio"],
    neighborhood_id: hoodId["urucunema"] ?? rndHood(),
  },
  // SERVIÇOS
  {
    name: "Auto Escola Dirigir Bem",
    slug: "auto-escola-dirigir-bem",
    description: "Habilitação nas categorias A, B e AB. Simuladores modernos, instrutores qualificados e aprovação garantida.",
    address: "Av. das Nações, 220 — Santo Antônio",
    phone: "(85) 3261-5500",
    whatsapp: "5585932615500",
    hours: "Seg–Sex 08h–18h | Sáb 08h–12h",
    image_url: U("photo-1449965408869-eaa3f722e40d", 800, 600),
    rating: 4.5, reviews_count: 201, featured: false,
    discount_label: "Matrícula: R$100 de desconto",
    category_id: catId["servicos"],
    neighborhood_id: hoodId["santo-antonio"] ?? rndHood(),
  },
  {
    name: "Escritório Fernandes & Associados",
    slug: "escritorio-fernandes-associados",
    description: "Advocacia trabalhista, civil e empresarial. Consultoria jurídica e assessoria em contratos.",
    address: "Rua do Comércio, 88 — Novo Portugal",
    phone: "(85) 3261-6600",
    whatsapp: "5585932616600",
    hours: "Seg–Sex 09h–18h",
    image_url: U("photo-1589829545856-d10d557cf95f", 800, 600),
    rating: 4.7, reviews_count: 54, featured: false,
    discount_label: "1ª consulta gratuita",
    category_id: catId["servicos"],
    neighborhood_id: hoodId["novo-portugal"] ?? rndHood(),
  },
  // AUTOMOTIVO
  {
    name: "Mecânica Boa Mão",
    slug: "mecanica-boa-mao",
    description: "Revisão, troca de óleo, suspensão, freios e ar-condicionado. Atendimento rápido e orçamento grátis.",
    address: "Estrada do Coité, 780 — Coité",
    phone: "(85) 9 9900-7700",
    whatsapp: "5585999007700",
    hours: "Seg–Sex 08h–18h | Sáb 08h–13h",
    image_url: U("photo-1487754180451-c456f719a1fc", 800, 600),
    rating: 4.6, reviews_count: 176, featured: false,
    discount_label: "Troca de óleo + filtro R$89",
    category_id: catId["automotivo"],
    neighborhood_id: hoodId["coite"] ?? rndHood(),
  },
  {
    name: "Lava a Jato Express",
    slug: "lava-a-jato-express",
    description: "Lavagem completa, enceramento, higienização interna e cristalização de pintura.",
    address: "Av. Parque Hawaí, 1100 — Parque Hawaí",
    phone: "(85) 9 9811-8800",
    whatsapp: "5585998118800",
    hours: "Seg–Sáb 08h–18h | Dom 09h–14h",
    image_url: U("photo-1558618666-fcd25c85cd64", 800, 600),
    rating: 4.5, reviews_count: 134, featured: false,
    discount_label: "Lavagem completa R$35",
    category_id: catId["automotivo"],
    neighborhood_id: hoodId["parque-hawai"] ?? rndHood(),
  },
  // LAZER & ESPORTE
  {
    name: "Academia Fitness Eusébio",
    slug: "academia-fitness-eusebio",
    description: "Musculação, aeróbico, cross training, spinning e pilates. Professores formados e equipamentos novos.",
    address: "Av. Laurentino Monteiro, 2200 — Guaribas",
    phone: "(85) 3261-9900",
    whatsapp: "5585932619900",
    hours: "Seg–Sex 05h30–22h | Sáb 07h–18h | Dom 08h–13h",
    image_url: U("photo-1534438327276-14e5300c3a48", 800, 600),
    rating: 4.7, reviews_count: 298, featured: true,
    discount_label: "Mensalidade R$89/mês",
    category_id: catId["lazer-esporte"],
    neighborhood_id: hoodId["guaribas"] ?? rndHood(),
  },
  {
    name: "Society Arena Eusébio",
    slug: "society-arena-eusebio",
    description: "4 quadras de grama sintética para futebol society, beach tennis e voleibol. Aluguel por hora.",
    address: "Rua da Lagoa, 450 — Terral",
    phone: "(85) 9 9700-0011",
    whatsapp: "5585997000011",
    hours: "Seg–Dom 08h–23h",
    image_url: U("photo-1529900748604-07564a03e7a6", 800, 600),
    rating: 4.6, reviews_count: 87, featured: false,
    discount_label: "Hora do rush R$80",
    category_id: catId["lazer-esporte"],
    neighborhood_id: hoodId["terral"] ?? rndHood(),
  },
  // EDUCAÇÃO
  {
    name: "Colégio Aprender Mais",
    slug: "colegio-aprender-mais",
    description: "Ensino fundamental e médio com excelência acadêmica. Preparatório para ENEM e vestibulares.",
    address: "Av. das Crianças, 300 — Olho D'água",
    phone: "(85) 3261-8800",
    whatsapp: "5585932618800",
    hours: "Seg–Sex 07h–18h",
    image_url: U("photo-1580582932707-520aed937b7b", 800, 600),
    rating: 4.5, reviews_count: 156, featured: false,
    discount_label: "Matrícula sem taxa em 2025",
    category_id: catId["educacao"],
    neighborhood_id: hoodId["olho-dagua"] ?? rndHood(),
  },
  {
    name: "Advance Centro de Idiomas",
    slug: "advance-centro-de-idiomas",
    description: "Inglês, espanhol e francês para crianças, adolescentes e adultos. Professores nativos e metodologia imersiva.",
    address: "Rua da Cultura, 55 — Amador",
    phone: "(85) 9 9812-0099",
    whatsapp: "5585998120099",
    hours: "Seg–Sex 08h–21h | Sáb 08h–14h",
    image_url: U("photo-1546410531-bb4caa6b424d", 800, 600),
    rating: 4.8, reviews_count: 112, featured: false,
    discount_label: "Matrícula + 1 mês grátis",
    category_id: catId["educacao"],
    neighborhood_id: hoodId["amador"] ?? rndHood(),
  },
];

const { data: insertedBiz, error: bizErr } = await supabase
  .from("businesses")
  .insert(BUSINESSES)
  .select("id, name, slug");

if (!ok("Estabelecimentos inseridos", insertedBiz, bizErr)) process.exit(1);
console.log(`  → ${insertedBiz.length} negócios criados`);

// ─── 5. Produtos de exemplo para alguns estabelecimentos ─────────────────────

console.log("\n── Inserindo produtos de destaque ──");

const bizMap = Object.fromEntries(insertedBiz.map((b) => [b.slug, b.id]));

const PRODUCTS = [
  // Restaurante Sabor do Ceará
  { business_id: bizMap["restaurante-sabor-do-ceara"], name: "Carne de Sol com Manteiga", price: "R$ 42,90", image_url: U("photo-1604908176997-125f25cc6f3d", 600, 600) },
  { business_id: bizMap["restaurante-sabor-do-ceara"], name: "Baião de Dois Completo",   price: "R$ 35,90", image_url: U("photo-1546069901-ba9599a7e63c", 600, 600) },
  { business_id: bizMap["restaurante-sabor-do-ceara"], name: "Feijão Verde com Charque",  price: "R$ 32,90", image_url: U("photo-1547592180-85f173990554", 600, 600) },
  // Pizzaria Bella Napoli
  { business_id: bizMap["pizzaria-bella-napoli"], name: "Pizza Margherita GG",      price: "R$ 49,90", image_url: U("photo-1574071318508-1cdbab80d002", 600, 600) },
  { business_id: bizMap["pizzaria-bella-napoli"], name: "Pizza Calabresa + Cheddar", price: "R$ 54,90", image_url: U("photo-1513104890138-7c749659a591", 600, 600) },
  // Açaí da Vila
  { business_id: bizMap["acai-da-vila"], name: "Açaí Copo G 500ml",      price: "R$ 18,00", image_url: U("photo-1590301157890-4810ed352733", 600, 600) },
  { business_id: bizMap["acai-da-vila"], name: "Tigela 400ml + 3 compl", price: "R$ 22,00", image_url: U("photo-1494390248081-4e521a5940db", 600, 600) },
  // Academia Fitness
  { business_id: bizMap["academia-fitness-eusebio"], name: "Mensalidade Mensal",   price: "R$ 89,00", image_url: U("photo-1534438327276-14e5300c3a48", 600, 600) },
  { business_id: bizMap["academia-fitness-eusebio"], name: "Plano Semestral",      price: "R$ 449,00", image_url: U("photo-1571019613454-1cb2f99b2d8b", 600, 600) },
  { business_id: bizMap["academia-fitness-eusebio"], name: "Personal 4x/sem",      price: "R$ 320,00/mês", image_url: U("photo-1581009146145-b5ef050c2e1e", 600, 600) },
].filter((p) => p.business_id); // skip if biz not inserted

const { error: prodErr } = await supabase.from("business_products").insert(PRODUCTS);
ok("Produtos inseridos", !prodErr ? true : null, prodErr);

// ─── 6. Supermercados ────────────────────────────────────────────────────────

console.log("\n── Inserindo supermercados ──");

const today = new Date().toISOString().split("T")[0];
const validUntil = new Date();
validUntil.setDate(validUntil.getDate() + 6);
const valid_until = validUntil.toISOString().split("T")[0];

const SUPERMARKETS = [
  {
    name: "Supermercado Ideal Eusébio",
    slug: "supermercado-ideal-eusebio",
    logo_url: U("photo-1542838132-92c53300491e", 400, 400),
    cover_url: U("photo-1604719312566-8912e9227c6a", 1400, 600),
    description: "O supermercado mais completo de Eusébio. Açougue, peixaria, padaria e hortifrúti frescos todo dia.",
    address: "Av. Eusébio de Queirós, 3500 — Centro",
    phone: "(85) 3261-0001",
    pages: [
      U("photo-1556742049-0cfed4f6a45d", 1400, 1980),
      U("photo-1608686207856-001b95cf60ca", 1400, 1980),
      U("photo-1534723452862-4c874986ebad", 1400, 1980),
    ],
    highlights: [
      { product_name: "Arroz Tipo 1 — 5kg",           original_price: 28.90, sale_price: 19.90, image_url: U("photo-1586201375761-83865001e31c", 600, 600) },
      { product_name: "Feijão Carioca — 1kg",          original_price: 12.90, sale_price: 8.49,  image_url: U("photo-1561043433-aaf687c4cf04", 600, 600) },
      { product_name: "Frango Inteiro — kg",           original_price: 15.90, sale_price: 9.99,  image_url: U("photo-1604503468506-a8da13d82791", 600, 600) },
      { product_name: "Leite Integral 1L",             original_price: 6.49,  sale_price: 4.79,  image_url: U("photo-1550583724-b2692b85b150", 600, 600) },
      { product_name: "Café Torrado 500g",             original_price: 19.90, sale_price: 13.49, image_url: U("photo-1495474472287-4d71bcdd2085", 600, 600) },
      { product_name: "Ovos Brancos — Dúzia",          original_price: 14.90, sale_price: 9.90,  image_url: U("photo-1587486913049-53fc88980cfc", 600, 600) },
      { product_name: "Óleo de Soja 900ml",            original_price: 9.90,  sale_price: 6.99,  image_url: U("photo-1474979266404-7eaacbcd87c5", 600, 600) },
      { product_name: "Cerveja Lata 350ml — Pack 12", original_price: 59.90, sale_price: 42.90, image_url: U("photo-1535958636474-b021ee887b13", 600, 600) },
    ],
  },
  {
    name: "Atacadão Eusébio",
    slug: "atacadao-eusebio",
    logo_url: U("photo-1604719312566-8912e9227c6a", 400, 400),
    cover_url: U("photo-1542838132-92c53300491e", 1400, 600),
    description: "Compre mais, economize mais. Atacarejo com preços de atacado para o consumidor final.",
    address: "Rodovia CE-040, km 15 — Tamatanduba",
    phone: "(85) 3261-0002",
    pages: [
      U("photo-1583258292688-d0213dc5a3a8", 1400, 1980),
      U("photo-1556742393-d75f468bfcb0", 1400, 1980),
      U("photo-1490818387583-1baba5e638af", 1400, 1980),
    ],
    highlights: [
      { product_name: "Açúcar Cristal — 5kg",       original_price: 22.90, sale_price: 16.90, image_url: U("photo-1559622214-f8a9850965bb", 600, 600) },
      { product_name: "Macarrão Espaguete — 500g",   original_price: 5.90,  sale_price: 3.49,  image_url: U("photo-1551462147-ff29053bfc14", 600, 600) },
      { product_name: "Farinha de Trigo — 1kg",      original_price: 7.90,  sale_price: 4.99,  image_url: U("photo-1574323347407-f5e1ad6d020b", 600, 600) },
      { product_name: "Leite em Pó — 400g",          original_price: 18.90, sale_price: 13.90, image_url: U("photo-1550583724-b2692b85b150", 600, 600) },
      { product_name: "Sabão em Pó — 1kg",           original_price: 16.90, sale_price: 11.49, image_url: U("photo-1585771724684-38269d6639fd", 600, 600) },
      { product_name: "Biscoito Recheado — cx 30un", original_price: 38.90, sale_price: 24.90, image_url: U("photo-1558961363-fa8fdf82db35", 600, 600) },
      { product_name: "Detergente 500ml — cx 12",    original_price: 42.90, sale_price: 28.90, image_url: U("photo-1563453392212-326f5e854473", 600, 600) },
    ],
  },
  {
    name: "Mercadinho Família Precabura",
    slug: "mercadinho-familia-precabura",
    logo_url: U("photo-1567620905732-2d1ec7ab7445", 400, 400),
    cover_url: U("photo-1567620905732-2d1ec7ab7445", 1400, 600),
    description: "O mercado do seu bairro, com o carinho de sempre. Fresquinho, perto de casa.",
    address: "Rua da Praia, 90 — Precabura",
    phone: "(85) 3261-0003",
    pages: [
      U("photo-1534723452862-4c874986ebad", 1400, 1980),
      U("photo-1604719312566-8912e9227c6a", 1400, 1980),
    ],
    highlights: [
      { product_name: "Presunto Fatiado — 200g",  original_price: 11.90, sale_price: 7.99, image_url: U("photo-1546549032-9571cd6b27df", 600, 600) },
      { product_name: "Queijo Mussarela — 200g",  original_price: 13.90, sale_price: 9.49, image_url: U("photo-1486297678162-eb2a19b0a32d", 600, 600) },
      { product_name: "Iogurte Natural — 170g",   original_price: 3.90,  sale_price: 2.49, image_url: U("photo-1488477181946-6428a0291777", 600, 600) },
      { product_name: "Requeijão Cremoso — 200g", original_price: 9.90,  sale_price: 6.99, image_url: U("photo-1559561853-08451507cbe7", 600, 600) },
      { product_name: "Manteiga com Sal — 200g",  original_price: 12.90, sale_price: 8.99, image_url: U("photo-1589985270826-4b7bb135bc9d", 600, 600) },
    ],
  },
  {
    name: "Super Bom Preço Cidade Alpha",
    slug: "super-bom-preco-cidade-alpha",
    logo_url: U("photo-1517686469429-8bdb88b9f907", 400, 400),
    cover_url: U("photo-1517686469429-8bdb88b9f907", 1400, 600),
    description: "Preços baixos todos os dias, sem precisar de promoção. Hortifrúti fresquinho e açougue no local.",
    address: "Av. Cidade Alpha, 800 — Cidade Alpha",
    phone: "(85) 3261-0004",
    pages: [
      U("photo-1490818387583-1baba5e638af", 1400, 1980),
      U("photo-1556742049-0cfed4f6a45d", 1400, 1980),
      U("photo-1608686207856-001b95cf60ca", 1400, 1980),
    ],
    highlights: [
      { product_name: "Refrigerante 2L",           original_price: 9.90,  sale_price: 6.49,  image_url: U("photo-1598306442928-4d90f32c6866", 600, 600) },
      { product_name: "Suco Caixinha 1L",          original_price: 8.90,  sale_price: 5.99,  image_url: U("photo-1600271886742-f049cd451bba", 600, 600) },
      { product_name: "Água Mineral 1,5L Pack 6",  original_price: 18.90, sale_price: 12.90, image_url: U("photo-1548839140-29a749e1cf4d", 600, 600) },
      { product_name: "Café Solúvel 100g",         original_price: 14.90, sale_price: 9.99,  image_url: U("photo-1495474472287-4d71bcdd2085", 600, 600) },
      { product_name: "Cerveja Lata Pack 6",       original_price: 32.90, sale_price: 22.90, image_url: U("photo-1535958636474-b021ee887b13", 600, 600) },
      { product_name: "Achocolatado Pó 400g",      original_price: 16.90, sale_price: 11.99, image_url: U("photo-1481391319762-47dff72954d9", 600, 600) },
    ],
  },
  {
    name: "Mercado Tamatanduba",
    slug: "mercado-tamatanduba",
    logo_url: U("photo-1604719312566-8912e9227c6a", 400, 400),
    cover_url: U("photo-1556742393-d75f468bfcb0", 1400, 600),
    description: "Tradição e preço justo no coração do Tamatanduba. Padaria, açougue e mercearia completa.",
    address: "Rua das Cajazeiras, 230 — Tamatanduba",
    phone: "(85) 3261-0005",
    pages: [
      U("photo-1556742393-d75f468bfcb0", 1400, 1980),
      U("photo-1583258292688-d0213dc5a3a8", 1400, 1980),
    ],
    highlights: [
      { product_name: "Arroz Branco — 5kg",       original_price: 29.90, sale_price: 21.90, image_url: U("photo-1586201375761-83865001e31c", 600, 600) },
      { product_name: "Feijão Preto — 1kg",       original_price: 11.90, sale_price: 7.99,  image_url: U("photo-1561043433-aaf687c4cf04", 600, 600) },
      { product_name: "Óleo de Soja 900ml",       original_price: 9.90,  sale_price: 6.49,  image_url: U("photo-1474979266404-7eaacbcd87c5", 600, 600) },
      { product_name: "Molho de Tomate 340g",     original_price: 5.90,  sale_price: 3.29,  image_url: U("photo-1558818498-28c1e002b655", 600, 600) },
      { product_name: "Atum em Lata 170g",        original_price: 8.90,  sale_price: 5.99,  image_url: U("photo-1534482421-64566f976cfa", 600, 600) },
      { product_name: "Papel Higiênico 12 rolos", original_price: 29.90, sale_price: 19.90, image_url: U("photo-1583947215259-38e31be8751f", 600, 600) },
    ],
  },
];

let smCount = 0;
for (const sm of SUPERMARKETS) {
  const { pages, highlights, ...smData } = sm;

  const { data: created, error: smErr } = await supabase
    .from("supermarkets")
    .insert({ ...smData, active: true })
    .select()
    .single();

  if (smErr) { console.error(`✗ ${smData.name}:`, smErr.message); continue; }

  const validFrom = new Date();
  validFrom.setDate(validFrom.getDate() - 1);

  const { data: flyer, error: flyerErr } = await supabase
    .from("flyers")
    .insert({
      supermarket_id: created.id,
      valid_from: validFrom.toISOString().split("T")[0],
      valid_until,
      pages,
      active: true,
    })
    .select()
    .single();

  if (flyerErr) { console.error(`✗ encarte ${smData.name}:`, flyerErr.message); continue; }

  const { error: hlErr } = await supabase
    .from("flyer_highlights")
    .insert(highlights.map((h) => ({ ...h, flyer_id: flyer.id })));

  if (hlErr) { console.error(`✗ highlights ${smData.name}:`, hlErr.message); }

  smCount++;
  console.log(`✓ ${smData.name} — ${highlights.length} ofertas, ${pages.length} páginas`);
}

// ─── 7. Cupons de desconto ───────────────────────────────────────────────────

console.log("\n── Inserindo cupons ──");

// buscar IDs reais dos negócios inseridos
const bizIdOf = (slug) => bizMap[slug];

const expires30 = new Date();
expires30.setDate(expires30.getDate() + 30);
const exp30 = expires30.toISOString();

const expires7 = new Date();
expires7.setDate(expires7.getDate() + 7);
const exp7 = expires7.toISOString();

const COUPONS = [
  {
    business_id: bizIdOf("restaurante-sabor-do-ceara"),
    code: "SABOR10",
    discount_label: "10% de desconto",
    description: "10% de desconto em qualquer prato do cardápio no almoço. Válido de segunda a sexta.",
    expires_at: exp30,
    active: true,
  },
  {
    business_id: bizIdOf("pizzaria-bella-napoli"),
    code: "PIZZA2X1",
    discount_label: "Pizza GG no dobro",
    description: "Peça uma pizza GG e leve a segunda de qualquer sabor por R$1. Válido às terças e quartas.",
    expires_at: exp7,
    active: true,
  },
  {
    business_id: bizIdOf("padaria-doce-pao"),
    code: "CAFEMANHA",
    discount_label: "Café da manhã R$15",
    description: "Café completo (café, suco, 2 salgados e fatia de bolo) por apenas R$15. Seg a Sáb até 10h.",
    expires_at: exp30,
    active: true,
  },
  {
    business_id: bizIdOf("acai-da-vila"),
    code: "ACAIVILA",
    discount_label: "Copo G por R$18",
    description: "Copo G de açaí (500ml) com 3 complementos à sua escolha por R$18. Qualquer dia.",
    expires_at: exp30,
    active: true,
  },
  {
    business_id: bizIdOf("farmacia-saude-total"),
    code: "GENERIC20",
    discount_label: "20% em genéricos",
    description: "20% de desconto em todos os medicamentos genéricos. Apresente o cupom no caixa.",
    expires_at: exp30,
    active: true,
  },
  {
    business_id: bizIdOf("salao-bella-arte"),
    code: "BELLA65",
    discount_label: "Escova + hidratação R$65",
    description: "Escova progressiva + hidratação profunda por R$65. Agendar com 24h de antecedência.",
    expires_at: exp30,
    active: true,
  },
  {
    business_id: bizIdOf("barbearia-styles"),
    code: "STYLE45",
    discount_label: "Corte + barba R$45",
    description: "Corte degradê + barba completa (navalha e hidratação) por R$45. Seg a Sáb.",
    expires_at: exp7,
    active: true,
  },
  {
    business_id: bizIdOf("academia-fitness-eusebio"),
    code: "FIT1MES",
    discount_label: "1º mês R$49",
    description: "Primeiro mês de musculação + aulas coletivas por R$49. Apenas para novos alunos.",
    expires_at: exp30,
    active: true,
  },
  {
    business_id: bizIdOf("mecanica-boa-mao"),
    code: "OLEO89",
    discount_label: "Troca de óleo + filtro R$89",
    description: "Troca de óleo 5W30 sintético + filtro de óleo por R$89. Qualquer carro de passeio.",
    expires_at: exp30,
    active: true,
  },
  {
    business_id: bizIdOf("otica-visao-clara"),
    code: "OTICA2A1",
    discount_label: "2ª armação 50% off",
    description: "Na compra de uma armação, a segunda sai com 50% de desconto. Inclui óculos de sol.",
    expires_at: exp30,
    active: true,
  },
  {
    business_id: bizIdOf("lanchonete-ponto-x"),
    code: "PONTOX22",
    discount_label: "X-Tudo + refri R$22",
    description: "X-Tudo artesanal + refrigerante lata por R$22. Válido de 17h às 20h.",
    expires_at: exp7,
    active: true,
  },
  {
    business_id: bizIdOf("advance-centro-de-idiomas"),
    code: "ADVANCE1",
    discount_label: "Matrícula + 1 mês grátis",
    description: "Isento de matrícula + 1º mês grátis no curso de inglês para iniciantes. Vagas limitadas.",
    expires_at: exp30,
    active: true,
  },
].filter((c) => c.business_id); // remover se negócio não inserido

const { error: couponErr } = await supabase.from("coupons").insert(COUPONS);
ok(`${COUPONS.length} cupons inseridos`, !couponErr ? true : null, couponErr);

// ─── Resumo ──────────────────────────────────────────────────────────────────

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Seed GuiaEusébio concluído!

 ✓ ${BUSINESSES.length} estabelecimentos
 ✓ ${smCount} supermercados com encartes e ofertas
 ✓ ${COUPONS.length} cupons de desconto
 ✓ Produtos de destaque adicionados

 Acesse: http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠  Se ícones das categorias não aparecerem, rode no
   Supabase SQL Editor:
   ALTER TABLE public.categories
     ADD COLUMN IF NOT EXISTS icon_name text,
     ADD COLUMN IF NOT EXISTS color text;
   Depois recarregue a página — o update de icon/cor
   já foi aplicado via script.
`);

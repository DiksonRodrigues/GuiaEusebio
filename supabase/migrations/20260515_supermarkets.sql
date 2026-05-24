-- Supermercados
CREATE TABLE supermarkets (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  logo_url    text,
  description text,
  address     text,
  phone       text,
  active      boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- Encartes semanais
CREATE TABLE flyers (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  supermarket_id   uuid REFERENCES supermarkets(id) ON DELETE CASCADE NOT NULL,
  valid_from       date NOT NULL,
  valid_until      date NOT NULL,
  pages            text[] DEFAULT '{}',
  active           boolean DEFAULT true,
  created_at       timestamptz DEFAULT now()
);

-- Ofertas destaque do encarte
CREATE TABLE flyer_highlights (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  flyer_id       uuid REFERENCES flyers(id) ON DELETE CASCADE NOT NULL,
  product_name   text NOT NULL,
  original_price numeric(10,2),
  sale_price     numeric(10,2) NOT NULL,
  image_url      text,
  created_at     timestamptz DEFAULT now()
);

-- RLS: leitura pública para as 3 tabelas
ALTER TABLE supermarkets ENABLE ROW LEVEL SECURITY;
ALTER TABLE flyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flyer_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read supermarkets" ON supermarkets FOR SELECT USING (true);
CREATE POLICY "public read flyers" ON flyers FOR SELECT USING (true);
CREATE POLICY "public read flyer_highlights" ON flyer_highlights FOR SELECT USING (true);

-- Tabela de Leads (formulário de Anunciar)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  responsible TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Permitir inserção pública (o formulário é público)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserção pública de leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Apenas leitura autenticada (para você consultar no painel)
CREATE POLICY "Leitura apenas para autenticados"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

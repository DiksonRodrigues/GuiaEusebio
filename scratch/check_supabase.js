const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  const tables = ['cities', 'categories', 'businesses', 'business_images', 'business_products'];
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Tabela ${table}: ERRO - ${error.message}`);
    } else {
      console.log(`Tabela ${table}: ${count} linhas found.`);
    }
  }
}

checkData();

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// product id → correct image URL (webp, 400px)
const PRODUCT_FIXES = {
  // ── Ótica Ver Bem ──────────────────────────────────────────────
  'fc6f9447-7733-4cc4-85f1-a1b813430c76': // Óculos Solar Oakley
    'https://images.unsplash.com/photo-1508296695146-257a814070b4?fm=webp&w=400&q=80',
  'e54c88fc-78af-487e-a20c-f390fe6e7a4c': // Armação Ray-Ban
    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?fm=webp&w=400&q=80',
  'f08f8b25-2f82-4997-943d-6b4d86466bf3': // Lentes Antirreflexo
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?fm=webp&w=400&q=80',

  // ── Gelateria Dolce Vita ───────────────────────────────────────
  '463bf7fc-cdd3-45f7-a919-4cb288e6d269': // Gelato Médio
    'https://images.unsplash.com/photo-1567206563174-369769828c24?fm=webp&w=400&q=80',
  'c166e323-4ea3-4902-84bf-2e883eefa94e': // Casquinha Gourmet
    'https://images.unsplash.com/photo-1488900128323-21503983a07e?fm=webp&w=400&q=80',
  '6386907e-ec10-48b4-b1f8-aa87ca482006': // Petit Gateau
    'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?fm=webp&w=400&q=80',
  'c652020d-e7eb-437a-88c3-7e8fd6f956df': // Café Afogatto
    'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?fm=webp&w=400&q=80',

  // ── Produtos restantes: só converte para webp ──────────────────
  '3d4aa7b5-a23f-466e-b275-89d319689a8d': // Aconchego - Baião de Dois
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?fm=webp&w=400&q=80',
  '3e9f93bb-6f9f-45fb-8edd-477a16356d6c': // Aconchego - Carne de Sol
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?fm=webp&w=400&q=80',
  'b72ec665-7d68-45ff-b391-86d65f8871c9': // Aconchego - Peixe na Brasa
    'https://images.unsplash.com/photo-1550966842-28c46019313d?fm=webp&w=400&q=80',
  'a44369b0-f4bc-4a9e-83e5-9a72809bbcbf': // Aconchego - Suco Natural
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?fm=webp&w=400&q=80',
  'b4c2e560-e5c5-4391-9a34-f2772e7a13e1': // Moda Fashion - Camiseta
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?fm=webp&w=400&q=80',
  '2a33d455-ea4f-4bd5-ac32-bcb30a85836e': // Moda Fashion - Calça Jeans
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?fm=webp&w=400&q=80',
  '962e7d3d-d605-46e6-8496-7ee97041669c': // Moda Fashion - Vestido Floral
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?fm=webp&w=400&q=80',
  '863d4f57-f5d0-4d6d-b953-8751a501c77c': // Moda Fashion - Tênis
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?fm=webp&w=400&q=80',
  '090ffb76-375d-48e3-afcb-c812011b594e': // Grão & Arte - Cappuccino
    'https://images.unsplash.com/photo-1534778101976-62847782c213?fm=webp&w=400&q=80',
  '9d3e2b3d-e83a-44bd-83b7-50f166d7ff2b': // Grão & Arte - Espresso
    'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?fm=webp&w=400&q=80',
  '1c387d69-8b95-455d-8767-02d27d067016': // Grão & Arte - Croissant
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?fm=webp&w=400&q=80',
  '4a9f76e4-b695-408a-b23d-45e13d3e11ae': // Grão & Arte - Bolo Red Velvet
    'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?fm=webp&w=400&q=80',
  '5715a5d3-2164-431e-a273-302211036b86': // Burger Master - Burger Clássico
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?fm=webp&w=400&q=80',
  '57e7199a-3eba-4e61-b140-a5f09b91dd98': // Burger Master - Cheddar Bacon
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?fm=webp&w=400&q=80',
  'b01736fb-517e-4ac5-8975-25bdedeb311e': // Burger Master - Batata Frita
    'https://images.unsplash.com/photo-1573082836141-549449298ac1?fm=webp&w=400&q=80',
  'a9da57a4-f0b5-4a88-8193-f0b937d4367e': // Burger Master - Milkshake
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?fm=webp&w=400&q=80',
  '229877ad-4355-4636-aa16-c4a6b08589e9': // Sushi Prime - Festival
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?fm=webp&w=400&q=80',
  '97269b58-0550-4626-a3cd-b2c80d7ea17f': // Sushi Prime - Combinado 20 peças
    'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?fm=webp&w=400&q=80',
  'a05d1df0-c23d-472a-a29b-43035df1ac21': // Sushi Prime - Temaki Salmão
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?fm=webp&w=400&q=80',
  'd28a3249-b0af-4dbd-ba36-25cff487f7cc': // Sushi Prime - Ceviche Mix
    'https://images.unsplash.com/photo-1553621042-f6e147245754?fm=webp&w=400&q=80',
};

// business id → correct hero image (webp, 800px)
const BUSINESS_IMAGE_FIXES = {
  'b1111111-1111-4111-a111-111111111111': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=webp&w=800&q=80',
  'b2222222-2222-4222-a222-222222222222': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?fm=webp&w=800&q=80',
  'b3333333-3333-4333-a333-333333333333': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?fm=webp&w=800&q=80',
  'b4444444-4444-4444-a444-444444444444': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?fm=webp&w=800&q=80',
  'b5555555-5555-4555-a555-555555555555': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?fm=webp&w=800&q=80',
  'b6666666-6666-4666-a666-666666666666': 'https://images.unsplash.com/photo-1597733336794-12d05021d510?fm=webp&w=800&q=80',
  'b7777777-7777-4777-a777-777777777777': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?fm=webp&w=800&q=80',
  'b8888888-8888-4888-a888-888888888888': 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?fm=webp&w=800&q=80',
  'b9999999-9999-4999-a999-999999999999': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?fm=webp&w=800&q=80',
  'baaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?fm=webp&w=800&q=80',
  'bccccccc-cccc-4ccc-cccc-cccccccccccc': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?fm=webp&w=800&q=80',
  'bddddddd-dddd-4ddd-dddd-dddddddddddd': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?fm=webp&w=800&q=80',
  'beeeeeee-eeee-4eee-eeee-eeeeeeeeeeee': 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?fm=webp&w=800&q=80',
  'b0000000-0000-4000-a000-000000000001': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?fm=webp&w=800&q=80',
  'b0000000-0000-4000-a000-000000000002': 'https://images.unsplash.com/photo-1545173168-9f18c82b9975?fm=webp&w=800&q=80',
  'b0000000-0000-4000-a000-000000000003': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?fm=webp&w=800&q=80',
  'b0000000-0000-4000-a000-000000000004': 'https://images.unsplash.com/photo-1517524006129-475269f5c9ef?fm=webp&w=800&q=80',
  'b0000000-0000-4000-a000-000000000005': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?fm=webp&w=800&q=80',
  'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?fm=webp&w=800&q=80',
  'bfffffff-ffff-4fff-ffff-ffffffffffff': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?fm=webp&w=800&q=80',
};

async function main() {
  let ok = 0, fail = 0;

  console.log('\n── Atualizando produtos ──────────────────────────────');
  for (const [id, image_url] of Object.entries(PRODUCT_FIXES)) {
    const { error } = await sb.from('business_products').update({ image_url }).eq('id', id);
    if (error) { console.error(`  FAIL ${id}: ${error.message}`); fail++; }
    else { console.log(`  OK   ${id.slice(0, 8)}…`); ok++; }
  }

  console.log('\n── Atualizando hero de negócios ──────────────────────');
  for (const [id, image_url] of Object.entries(BUSINESS_IMAGE_FIXES)) {
    const { error } = await sb.from('businesses').update({ image_url }).eq('id', id);
    if (error) { console.error(`  FAIL ${id}: ${error.message}`); fail++; }
    else { console.log(`  OK   ${id.slice(0, 8)}…`); ok++; }
  }

  // Also fix "Serviço/Produto Padrão" entries: set their image to the business hero
  console.log('\n── Sincronizando imagem dos "Serviço/Produto Padrão" ──');
  const genericIds = [
    'd00a47bb-af2b-4356-ac68-05594c2f6208', // Auto Tech
    '4ed78e16-6eb7-41d7-bba3-3d6699be6911', // Sorriso Ideal
    '03499ad7-7ef3-42fc-9f70-e656f0500111', // Tech Fix
    '97f44153-4d17-4b49-b1df-dcdd793248d2', // Pet Shop
    '25cfe8a6-22bc-421c-8552-edeec28a1ad7', // Academia
    '9f3f33f5-2e31-4aad-a8be-b28607194340', // Livraria
    '9c80c1ee-821c-4572-a31a-e0da4a570dc5', // Barbearia
    '89cb7328-7c90-45e2-9b36-97debeccb816', // Floricultura
    '52df62ba-d567-40cd-917b-f6a41a9d64aa', // Vet Vida
    '7c9ce86b-3db0-48a3-be55-56801453661f', // Lavanderia
    '091852cb-ca91-40c0-b004-f19dfa1d7b6f', // Pizzaria
    '4a2fb912-5bdc-4260-bc9d-909412c8a153', // Centro Auto Speed
    '7d6fa306-3de3-4e9f-a39f-3c028bc9897c', // Espaço Zen
  ];
  // For these, just add ?fm=webp&w=400&q=80 by fetching current value and re-saving
  const { data: generics } = await sb.from('business_products')
    .select('id, image_url, business_id')
    .in('id', genericIds);

  for (const prod of generics) {
    // Use the already-updated business hero (webp version)
    const newUrl = BUSINESS_IMAGE_FIXES[prod.business_id] || prod.image_url;
    const image_url = newUrl.includes('fm=webp') ? newUrl.replace('w=800', 'w=400') : newUrl + '?fm=webp&w=400&q=80';
    const { error } = await sb.from('business_products').update({ image_url }).eq('id', prod.id);
    if (error) { console.error(`  FAIL ${prod.id}: ${error.message}`); fail++; }
    else { console.log(`  OK   ${prod.id.slice(0, 8)}…`); ok++; }
  }

  console.log(`\n✓ ${ok} atualizados | ${fail} erros`);
}

main().catch(console.error);

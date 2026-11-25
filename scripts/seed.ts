// One-time seed: populates Supabase from the content that used to live in
// src/content/*.ts and the hardcoded prose in app/page.tsx.
// Run with: npm run seed  (after NEXT_PUBLIC_SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are set in .env.local)

try {
  process.loadEnvFile?.('.env.local');
} catch {
  console.error(
    'Could not find .env.local in the portfolio folder.\n' +
      'Copy .env.local.example to a new file named exactly ".env.local" and fill in the values, then run this again.',
  );
  process.exit(1);
}

for (const name of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!process.env[name]) {
    console.error(`${name} is empty in .env.local. Fill it in (never paste it into chat), then run this again.`);
    process.exit(1);
  }
}

import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  realtime: { transport: ws as unknown as typeof WebSocket },
});

async function main() {
  await supabase.from('profile').upsert({
    id: 1,
    name: 'Dwayne Kasper',
    location: 'Lagos, Nigeria',
    role_title: 'Software Architect',
    current_role_text:
      'I’m a software architect in Lagos. I take a product from a rough idea to something people use and pay for: I decide how the system fits together, design the data, wire in the payments, and build the mobile and web apps myself.',
    previous_role_text:
      'I’m leading the build of Uncollos, an interior design company’s furniture customization platform. Before that I built mobile at Spaxe (formerly SPACE), a house-renting platform with budget and location search and a 3D view of listings. I also build my own products for the Nigerian market, including Kosher Spa and Vulttra.',
    now_text:
      'Making AI part of how products get designed and shipped, from Vulttra’s content studio to the AI interview tool Bogey, while moving my backends to Python.',
    email: 'dwaynekasperlamar@gmail.com',
    github_url: 'https://github.com/DwaynekasperLamar',
    twitter_url: 'https://twitter.com/Dwaynekasper_',
  });

  const projects = [
    {
      slug: 'uncollos',
      title: 'Uncollos',
      description: 'Interior design & furniture customization platform.',
      href: 'https://uncollos.store/',
      logo_url: '/assets/oncollos.png',
      sort_order: 1,
    },
    {
      slug: 'spaxe',
      title: 'Spaxe',
      description: 'House renting by budget & location, with 3D listing previews.',
      href: 'https://spaxe.site',
      logo_url: '/assets/spaxe.jpeg',
      sort_order: 2,
    },
    {
      slug: 'kosher-spa',
      title: 'Kosher Spa',
      description: 'Mobile booking for spa/salon/barbing appointments in Port Harcourt.',
      href: 'https://kosherspa.site',
      logo_url: 'https://www.google.com/s2/favicons?domain=kosherspa.site&sz=128',
      sort_order: 3,
    },
    {
      slug: 'vulttra',
      title: 'Vulttra',
      description: 'AI content generator (images, video, audio) for African SMEs.',
      href: 'https://vulltra-inc.vercel.app',
      logo_url: 'https://vulltra-inc.vercel.app/favicon.ico',
      sort_order: 4,
    },
  ];
  await supabase.from('projects').upsert(projects);

  const techItems = [
    { label: 'React', icon_key: 'react', category: 'stack', sort_order: 1 },
    { label: 'Next.js', icon_key: 'nextdotjs', category: 'stack', sort_order: 2 },
    { label: 'TypeScript', icon_key: 'typescript', category: 'stack', sort_order: 3 },
    { label: 'Tailwind CSS', icon_key: 'tailwindcss', category: 'stack', sort_order: 4 },
    { label: 'Expo / React Native', icon_key: 'expo', category: 'stack', sort_order: 5 },
    { label: 'GSAP', icon_key: 'greensock', category: 'stack', sort_order: 6 },
    { label: 'Python', icon_key: 'python', category: 'skill', sort_order: 7 },
    { label: 'AI tooling', icon_key: 'huggingface', category: 'skill', sort_order: 8 },
  ];
  await supabase.from('tech_items').insert(techItems);

  console.log('Seed complete.');
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);

// One-time seed: populates Supabase from the content that used to live in
// src/content/*.ts and the hardcoded prose in app/page.tsx.
// Run with: npm run seed  (after NEXT_PUBLIC_SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are set in .env.local)

process.loadEnvFile?.('.env.local');

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
    role_title: 'Software Developer',
    current_role_text:
      'I’m a software developer working mostly in React, Next.js, TypeScript and Expo — across web and mobile. Currently lead developer at Uncollos, an interior design company building a furniture customization platform.',
    previous_role_text:
      'Before that I was a mobile developer at Spaxe (formerly SPACE), a house-renting platform built around budget and location search, with a 3D view of listings before you rent or buy.',
    now_text:
      'Building Vulttra, and generally leaning into AI-assisted product workflows — it shows up across Vulttra, Kosher Spa, and the AI interview tool Bogey.',
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
      logo_url: 'https://www.google.com/s2/favicons?domain=vulltra-inc.vercel.app&sz=128',
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
    { label: 'AI tooling', icon_key: 'openai', category: 'skill', sort_order: 8 },
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

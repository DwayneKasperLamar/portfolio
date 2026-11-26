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
      'I work as a software architect at Kosher Spa, and at Uncollos, a startup I co-founded. I decide how a system fits together, design the data and the money flows, and direct AI coding agents to build it. I check what ships.',
    previous_role_text: '',
    now_text: 'Open to remote roles',
    email: 'dwaynekasperlamar@gmail.com',
    github_url: 'https://github.com/DwaynekasperLamar',
    twitter_url: 'https://twitter.com/Dwaynekasper_',
  });

  const projects = [
    {
      slug: 'uncollos',
      title: 'Uncollos',
      description: 'Interior design & furniture customization platform.',
      href: '',
      logo_url: '/assets/oncollos.png',
      sort_order: 1,
    },
    {
      slug: 'spaxe',
      title: 'Spaxe',
      description: 'House renting by budget & location, with 3D listing previews.',
      href: '',
      logo_url: '/assets/spaxe.jpeg',
      sort_order: 2,
    },
    {
      slug: 'kosher-spa',
      title: 'Kosher Spa',
      description: 'Mobile booking for spa/salon/barbing appointments in Port Harcourt.',
      href: 'https://kosherspa.site',
      logo_url: '/assets/logos/kosher-spa.png',
      sort_order: 3,
    },
    {
      slug: 'vulttra',
      title: 'Vulttra',
      description: 'No-prompt AI content tool for African small businesses. Web app in production; mobile app in development.',
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
    { label: 'PostgreSQL', icon_key: 'postgresql', category: 'stack', sort_order: 6 },
    { label: 'Supabase', icon_key: 'supabase', category: 'stack', sort_order: 7 },
    { label: 'FastAPI', icon_key: 'fastapi', category: 'stack', sort_order: 8 },
    { label: 'Python', icon_key: 'python', category: 'skill', sort_order: 9 },
    { label: 'Claude Code', icon_key: 'claude', category: 'skill', sort_order: 10 },
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

// Starter content: the intro, "Working on", "What I do" and the books being read.
//   npm run seed:content                         -> only fills lists that are missing or empty (safe to repeat)
//   npm run seed:content -- --overwrite-profile  -> ALSO replaces the intro text (overwrites edits made in /admin/profile)
// Needs .env.local (never printed).

try {
  process.loadEnvFile?.('.env.local');
} catch {
  console.error('Could not find .env.local in the portfolio folder. Copy .env.local.example to .env.local and fill it in first.');
  process.exit(1);
}

import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  realtime: { transport: ws as unknown as typeof WebSocket },
});

const profileCopy = {
  role_title: 'Software Architect',
  current_role_text:
    'I’m a software architect in Lagos. I take a product from a rough idea to something people use and pay for: I decide how the system fits together, design the data, wire in the payments, and build the mobile and web apps myself.',
  previous_role_text:
    'I’m leading the build of Uncollos, an interior design company’s furniture customization platform. Before that I built mobile at Spaxe (formerly SPACE), a house-renting platform with budget and location search and a 3D view of listings. I also build my own products for the Nigerian market, including Kosher Spa and Vulttra.',
  now_text:
    'Making AI part of how products get designed and shipped, from Vulttra’s content studio to the AI interview tool Bogey, while moving my backends to Python.',
};

// PUBLIC items only. This repository may be public: never write private projects or private content into a
// file here. Add those in the admin, where they are stored in the database.
const workingOn = [
  {
    title: 'Vulttra',
    status: 'building',
    url: 'https://vulltra-inc.vercel.app',
    notes: 'AI studio that turns a business’s details into branded images, video and audio for African small businesses. Next: the audio rework.',
    visibility: 'public',
  },
  {
    title: 'Kosher Spa',
    status: 'shipping',
    url: 'https://kosherspa.site',
    notes: 'Booking app for a spa, salon and barbershop in Port Harcourt, with online payments. A bigger release is on the way.',
    visibility: 'public',
  },
  {
    title: 'Uncollos',
    status: 'leading the build',
    url: 'https://uncollos.store/',
    notes: 'Interior design and furniture customization platform.',
    visibility: 'public',
  },
];

const whatIDo = [
  { title: 'System architecture', notes: 'I decide how apps, servers, databases and outside services fit together, and write down why, so a decision can be changed on purpose later.' },
  { title: 'Mobile apps', notes: 'Expo and React Native, from the first screen to the Google Play listing.' },
  { title: 'Web platforms and admin tools', notes: 'Next.js and TypeScript: product sites, dashboards and the back office a business runs on.' },
  { title: 'Payments', notes: 'Paystack checkout, subscriptions, wallets and credits, with prices worked out on the server and never trusted from the app.' },
  { title: 'Backend and data', notes: 'Postgres and Supabase, with Python (FastAPI) for new services.' },
  { title: 'AI products', notes: 'AI features people can use without writing prompts, like turning a business’s details into branded content.' },
];

const books = [
  {
    title: 'Meditations',
    subtitle: 'Marcus Aurelius',
    status: 'reading now',
    url: 'https://openlibrary.org/works/OL1317211W',
    image_url: 'https://covers.openlibrary.org/b/id/211529-M.jpg',
  },
  {
    title: 'Crime and Punishment',
    subtitle: 'Fyodor Dostoevsky',
    status: 'reading now',
    url: 'https://openlibrary.org/works/OL45018229W',
    image_url: 'https://covers.openlibrary.org/b/id/15183762-M.jpg',
  },
];

interface Group {
  collection: { slug: string; title: string; kind: string; description: string; show_in_nav: boolean; sort_order: number };
  items: Record<string, string>[];
}

const groups: Group[] = [
  {
    collection: { slug: 'working-on', title: 'Working on', kind: 'other', description: 'What I am building right now. Shown at the top of the home page.', show_in_nav: false, sort_order: 0 },
    items: workingOn,
  },
  {
    collection: { slug: 'what-i-do', title: 'What I do', kind: 'other', description: 'Shown under the introduction on the home page.', show_in_nav: false, sort_order: 1 },
    items: whatIDo,
  },
  {
    collection: { slug: 'books', title: 'Books', kind: 'books', description: 'What I’m reading.', show_in_nav: true, sort_order: 2 },
    items: books,
  },
];

// Creates a collection and its starter items only if it is missing or empty, so edits made
// in the admin are never overwritten and nothing is duplicated.
async function ensureGroup({ collection, items }: Group) {
  const found = await supabase.from('collections').select('slug').eq('slug', collection.slug).maybeSingle();
  if (found.error) throw new Error(`${collection.slug}: ${found.error.message}`);
  if (!found.data) {
    const { error } = await supabase.from('collections').insert({ ...collection, visibility: 'public' });
    if (error) throw new Error(`${collection.slug}: ${error.message}`);
  }

  const { count, error: countError } = await supabase
    .from('collection_items')
    .select('id', { count: 'exact', head: true })
    .eq('collection_slug', collection.slug);
  if (countError) throw new Error(`${collection.slug}: ${countError.message}`);
  if ((count ?? 0) > 0) {
    console.log(`"${collection.title}" already has ${count} items, left alone.`);
    return;
  }

  const { error } = await supabase
    .from('collection_items')
    .insert(items.map((item, i) => ({ visibility: 'public', ...item, collection_slug: collection.slug, sort_order: i + 1 })));
  if (error) throw new Error(`${collection.slug}: ${error.message}`);
  console.log(`"${collection.title}": added ${items.length} items.`);
}

async function main() {
  if (process.argv.includes('--overwrite-profile')) {
    const { error } = await supabase.from('profile').update(profileCopy).eq('id', 1);
    if (error) throw new Error(`profile: ${error.message}`);
    console.log('Intro text updated.');
  } else {
    console.log('Intro text left alone (add --overwrite-profile to replace it).');
  }

  for (const group of groups) await ensureGroup(group);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err.message ?? err);
    process.exit(1);
  },
);

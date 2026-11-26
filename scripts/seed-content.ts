// Starter content for the home page lists. PUBLIC items only: this repository may be public,
// so drafts and private writing are added in the admin and live only in the database.
//   npm run seed:content                         -> only fills lists that are missing or empty (safe to repeat)
//   npm run seed:content -- --overwrite-profile  -> ALSO replaces the headline and about text
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
  bio: 'I design mobile and web products that take payments, and build them with AI at the centre.',
  now_text: 'Open to remote roles',
  current_role_text:
    'I work as a software architect at Kosher Spa, and at Uncollos, a startup I co-founded. I decide how a system fits together, design the data and the money flows, and direct AI coding agents to build it. I check what ships.',
  previous_role_text: '',
};

interface Group {
  slug: string;
  title: string;
  kind: string;
  description: string;
  show_in_nav?: boolean;
  items: Record<string, string>[];
}

const groups: Group[] = [
  {
    slug: 'experience',
    title: 'Work experience',
    kind: 'other',
    description: 'Jobs. title = company, author = role, status = current or previous.',
    items: [
      {
        title: 'Kosher Spa',
        subtitle: 'Software Architect',
        status: 'current',
        url: 'https://kosherspa.site',
        image_url: '/assets/logos/kosher-spa.png',
        play_url: 'https://play.google.com/store/apps/details?id=site.kosherspa.booking',
        notes:
          'Booking platform for a spa, salon and barbershop in Port Harcourt: an Android app on Google Play, a web admin dashboard and the server behind both. Payments through Paystack and an in-app wallet, with the server deciding every price.',
      },
      {
        title: 'Uncollos',
        subtitle: 'Co-founder & Software Architect',
        status: 'current',
        image_url: '/assets/oncollos.png',
        notes: 'A startup building an interior design and furniture customization platform. I co-founded it and lead its software architecture.',
      },
      {
        title: 'Spaxe',
        subtitle: 'Mobile Developer',
        status: 'previous',
        image_url: '/assets/spaxe.jpeg',
        notes: 'Mobile development on a house-renting platform with budget and location search and a 3D view of listings.',
      },
    ],
  },
  {
    slug: 'ai-workflow',
    title: 'How I work with AI',
    kind: 'other',
    description: 'How AI is used in the work.',
    items: [
      { title: 'AI writes much of the code', notes: 'I don’t type every line. I work with AI coding agents, mainly Claude Code, so you are hiring someone who designs the system and directs the build.' },
      { title: 'The decisions are mine', notes: 'What to build, how the parts fit, how money and data are handled, and what is left out.' },
      { title: 'Plan before code', notes: 'A feature starts with an agreed plan: the words, the choices and the trade-offs.' },
      { title: 'Written rules for the agents', notes: 'Projects carry working rules the AI must follow: security checks, no secrets in code, nothing published without approval.' },
      { title: 'Checked before it ships', notes: 'New screens are approved as mockups first. Automated checks and a review pass follow, and I decide what gets fixed.' },
      { title: 'Decisions on record', notes: 'Session notes keep what was built, what I decided and why, so a team can follow it later.' },
    ],
  },
  {
    slug: 'what-i-do',
    title: 'What I do',
    kind: 'other',
    description: 'Areas of work.',
    items: [
      { title: 'System architecture', notes: 'I decide how apps, servers, databases and outside services fit together, and write down why, so a decision can be changed on purpose later.' },
      { title: 'Mobile apps', notes: 'Expo and React Native, from the first screen to the Google Play listing.' },
      { title: 'Web platforms and admin tools', notes: 'Next.js and TypeScript: product sites, dashboards and the back office a business runs on.' },
      { title: 'Payments', notes: 'Paystack checkout, subscriptions, wallets and credits, with prices worked out on the server and never trusted from the app.' },
      { title: 'Backend and data', notes: 'Postgres and Supabase, with Python (FastAPI) for new services.' },
      { title: 'AI products', notes: 'AI features people can use without writing prompts, like turning a business’s details into branded content.' },
    ],
  },
  {
    slug: 'work-with-me',
    title: 'Work with me',
    kind: 'other',
    description: 'What a business can hire me for.',
    items: [
      { title: 'Architecture review', notes: 'I look at how your apps, server, database and payments fit together, and give you a written list of what to fix first and why.' },
      { title: 'First version, designed and built', notes: 'From a rough idea to a working mobile app or web platform, with the decisions written down.' },
      { title: 'Payments', notes: 'Checkout, wallets and subscriptions with Paystack, with prices worked out on the server and designed so a retry cannot charge twice.' },
    ],
  },
  { slug: 'case-studies', title: 'Case studies', kind: 'other', description: 'title = name, author = where and your role, status = one-line summary.', items: [] },
  { slug: 'quotes', title: 'Quotes', kind: 'other', description: 'Real quotes only. title = name, author = their role, notes = what they said.', items: [] },
  { slug: 'contact', title: 'Contact', kind: 'other', description: 'Extra contact addresses. title = what to show, link = mailto: or web address.', items: [] },
  {
    slug: 'books',
    title: 'Books',
    kind: 'books',
    description: 'What I’m reading.',
    show_in_nav: true,
    items: [
      { title: 'Meditations', subtitle: 'Marcus Aurelius', status: 'reading now', url: 'https://openlibrary.org/works/OL1317211W', image_url: 'https://covers.openlibrary.org/b/id/211529-M.jpg' },
      { title: 'Crime and Punishment', subtitle: 'Fyodor Dostoevsky', status: 'reading now', url: 'https://openlibrary.org/works/OL45018229W', image_url: 'https://covers.openlibrary.org/b/id/15183762-M.jpg' },
    ],
  },
];

// Creates a list and its starter items only if it is missing or empty, so edits made in the
// admin are never overwritten and nothing is duplicated.
async function ensureGroup({ items, ...collection }: Group, order: number) {
  const found = await supabase.from('collections').select('slug').eq('slug', collection.slug).maybeSingle();
  if (found.error) throw new Error(`${collection.slug}: ${found.error.message}`);
  if (!found.data) {
    const { error } = await supabase
      .from('collections')
      .insert({ show_in_nav: false, ...collection, sort_order: order, visibility: 'public' });
    if (error) throw new Error(`${collection.slug}: ${error.message}`);
  }
  if (items.length === 0) return;

  const { count, error: countError } = await supabase
    .from('collection_items')
    .select('id', { count: 'exact', head: true })
    .eq('collection_slug', collection.slug);
  if (countError) throw new Error(`${collection.slug}: ${countError.message}`);
  if ((count ?? 0) > 0) {
    console.log(`"${collection.title}" already has ${count} items, left alone.`);
    return;
  }

  // One at a time: the items have different fields.
  for (const [i, item] of items.entries()) {
    const { error } = await supabase.from('collection_items').insert({ visibility: 'public', ...item, collection_slug: collection.slug, sort_order: i + 1 });
    if (error) throw new Error(`${collection.slug}: ${error.message}`);
  }
  console.log(`"${collection.title}": added ${items.length} items.`);
}

async function main() {
  if (process.argv.includes('--overwrite-profile')) {
    const { error } = await supabase.from('profile').update(profileCopy).eq('id', 1);
    if (error) throw new Error(`profile: ${error.message}`);
    console.log('Headline and about text updated.');
  } else {
    console.log('Profile text left alone (add --overwrite-profile to replace it).');
  }

  for (const [i, group] of groups.entries()) await ensureGroup(group, i);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err.message ?? err);
    process.exit(1);
  },
);

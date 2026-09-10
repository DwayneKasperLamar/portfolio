export interface Project {
  slug: string;
  title: string;
  desc: string;
  href: string;
}

export const myProjects: Project[] = [
  {
    slug: 'uncollos',
    title: 'Uncollos',
    desc: 'Interior design & furniture customization platform.',
    href: 'https://uncollos.store/',
  },
  {
    slug: 'spaxe',
    title: 'Spaxe',
    desc: 'House renting by budget & location, with 3D listing previews.',
    href: 'https://spaxe.site',
  },
  {
    slug: 'kosher-spa',
    title: 'Kosher Spa',
    desc: 'Mobile booking for spa/salon/barbing appointments in Port Harcourt.',
    href: 'https://kosherspa.site',
  },
  {
    slug: 'vulttra',
    title: 'Vulttra',
    desc: 'AI content generator (images, video, audio) for African SMEs.',
    href: 'https://vulltra-inc.vercel.app',
  },
];

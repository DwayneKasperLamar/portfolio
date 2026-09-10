export interface WorkExperience {
  id: number;
  name: string;
  url?: string;
  pos: string;
  duration: string;
  title: string;
  icon: string;
  animation: string;
}

export const workExperiences: WorkExperience[] = [
  {
    id: 1,
    name: 'Uncollos',
    url: 'https://uncollos.store/',
    pos: 'Lead Developer / Mobile',
    duration: '2022 - Present',
    title:
      'Uncollos is an interior design company that produces high-quality furniture and innovates existing home designs, combining craftsmanship with creativity to give customers a platform to customize their spaces.',
    icon: '/assets/oncollos.png',
    animation: 'victory',
  },
  {
    id: 2,
    name: 'Spaxe',
    url: 'https://spaxe.site',
    pos: 'Mobile Developer',
    duration: '2023 - 2024',
    title:
      'Spaxe is the Airbnb of Africa — it also covers finding roommates for students, and offers a 3D view of houses before renting or purchasing.',
    icon: '/assets/spacelogo.jpg',
    animation: 'clapping',
  },
];

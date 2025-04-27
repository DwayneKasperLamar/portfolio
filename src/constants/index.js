export const navLinks = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Work',
    href: '#work',
  },
  {
    id: 4,
    name: 'Contact',
    href: '#contact',
  },
];

export const clientReviews = [
  {
    id: 1,
    name: 'Mrs Emily',
    position: 'Marketing Director at GreenLeaf',
    // img: 'assets/review1.png',
    review:
      ' He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
  },
  {
    id: 2,
    name: 'Mr ighor',
    position: 'Founder of TechGear Shop',
    // img: 'assets/review2.png',
    review:
      'Dwayne’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional! Fantastic work.',
  },
  {
    id: 3,
    name: 'John Okafor',
    position: 'Project Manager at UrbanTech ',
    // img: 'assets/review3.png',
    review:
      'I can’t say enough good things about Dwayne. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
  },
  {
    id: 4,
    name: 'Renne Smith',
    position: 'CEO of BrightStar Enterprises',
    // img: 'assets/review4.png',
    review:
      'Dwayne was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
  },
];

export const myProjects = [
  {
    title: 'Uncollos -  Interior Design Company ',
    desc: 'Uncollos is an interior company that goes beyond traditional design. it specializes in producing all kinds of furniture while making design and integral part of its broader mission .Uncollos is commited to innovating existing products and concepts, offering a unique platform that empowers clients to customise thier spaces with creativity and precision.',
    subdesc:
      'Built as a unique Software-as-a-Service app with Next.js 14, Tailwind CSS, TypeScript, Framer Motion and Convex, Uncollos is designed for optimal performance and scalability.',
    href: 'https://uncollos.store/',
    // texture: '/textures/project/project1.mp4',
    logo: '/assets/oncollos.png',
    logoStyle: {
      backgroundColor: '#2A1816',
      border: '0.2px solid #36201D',
      boxShadow: '0px 0px 60px 0px #AA3C304D',
    },
    spotlight: '/assets/spotlight1.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Sanity CMS',
        path: '/assets/icon-sanity.jpg',
      },
    ],
  },
  {
    title: 'Binge By Uncollos - A Movie Application',
    desc: 'Binge is a dynamic and user-friendly movie streaming platform designed for movie lovers who want an extensive library of films at their fingertips. With a sleek, intuitive interface, Binge offers an endless selection of movies across all genres, from the latest blockbusters to timeless classics. The site’s seamless navigation makes it easy to discover new titles or revisit old favorites, with personalized recommendations tailored to your viewing history.',
    subdesc:
      'With multiple subscription tiers and flexible viewing options, Binge ensures that movie buffs have an optimal streaming experience anytime, anywhere.',
    href: 'https://binge-ten.vercel.app/',
    texture: '/textures/project/project2.mp4',
    logo: '/assets/Binge.jpg',
    logoStyle: {
      backgroundColor: '#13202F',
      border: '0.2px solid #17293E',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
    },
    spotlight: '/assets/spotlight2.jpg',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'Spaxe - House Renting Platform',
    desc: 'Space is a cutting-edge house renting platform that allows users to search for rental properties based on two key factors: budget and location. Whether you are  a first-time renter, relocating to a new city, or just looking for a change, Space simplifies the process by offering a personalized and user-friendly experience.',
    subdesc:
      'In today’s fast-paced world, finding a house that meets your budget and fits your ideal location can feel like a daunting task. That’s where Space comes in — a revolutionary house renting platform designed to make your search for the perfect home easier and more efficient.',
    href: 'https://spaxe.site',
    // texture: '/textures/project/project3.mp4',
    logo: '/assets/spaxe.jpeg',
    logoStyle: {
      backgroundColor: '#60f5a1',
      background:
        'linear-gradient(0deg, #60F5A150, #60F5A150), linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(208, 213, 221, 0.8) 100%)',
      border: '0.2px solid rgba(208, 213, 221, 1)',
      boxShadow: '0px 0px 60px 0px rgba(35, 131, 96, 0.3)',
    },
    spotlight: '/assets/spotlight3.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'Bogey - Online AI Interview Platform',
    desc: 'An Ai interview that help you practise interview. Built with vapi Ai and Gemini powerfull infastructure with customised enviroment and voices.',
    subdesc:
      'Built with Next.js, Firebase Vapi and Gemini, Bogey ensures a comprehesive interview questions as you will get as in a real interview.',
    href: 'https://bogey-interview.vercel.app/',
    // texture: '/textures/project/project4.mp4',
    logo: '/assets/project-logo4.png',
    logoStyle: {
      backgroundColor: '#0E1F38',
      border: '0.2px solid #0E2D58',
      boxShadow: '0px 0px 60px 0px #2F67B64D',
    },
    spotlight: '/assets/spotlight4.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      // {
      //   id: 4,
      //   name: 'Framer Motion',
      //   path: '/assets/framer.png',
      // },
    ],
  },
  {
    title: 'Imaginify - AI Photo Manipulation App',
    desc: 'Imaginify is a groundbreaking Software-as-a-Service application that empowers users to create stunning photo manipulations using AI technology. With features like AI-driven image editing, a payments system, and a credits-based model.',
    subdesc:
      'Built with Next.js 14, Cloudinary AI, Clerk, and Stripe, Imaginify combines cutting-edge technology with a user-centric approach. It can be turned into a side income or even a full-fledged business.',
    href: 'https://www.youtube.com/watch?v=Ahwoks_dawU',
    texture: '/textures/project/project5.mp4',
    logo: '/assets/project-logo5.png',
    logoStyle: {
      backgroundColor: '#1C1A43',
      border: '0.2px solid #252262',
      boxShadow: '0px 0px 60px 0px #635BFF4D',
    },
    spotlight: '/assets/spotlight5.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
    reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [12, 3, 0],
    ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
    targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
  };
};

export const workExperiences = [
  {
    id: 1,
    name: 'Oncollos (startup)',
    pos: 'Lead Developer/mobile',
    duration: '2022 - Present',
    title: "onCollos is an interior company that produces high-quality furniture and innovates existing home designes. it combines craftsmanship with creativiy to offer customers a platform to customize thier spaces.",
    icon: '/assets/oncollos.png',
    animation: 'victory',
  },
  {
    id: 2,
    name: 'SPACE (startup)',
    pos: 'Mobile Developer',
    duration: '2023 - 2024',
    title: "SPACE is the Airbnb of Africa in offers more like searching for roomates if your a student, it also offers you a 3d view of houses before making rent or purchases. ",
    icon: '/assets/spacelogo.jpg',
    animation: 'clapping',
  },
//   {
//     id: 3,
//     name: 'oncollos',
//     pos: 'Junior Web Developer',
//     duration: '2019 - 2020',
//     title: "Notion helps me keep my projects organized. I use it for project management, task tracking, and as a central hub for documentation, ensuring that everything from design notes to.",
//     icon: '/assets/notion.svg',
//     animation: 'salute',
//   },
];
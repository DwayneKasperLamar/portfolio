'use client';

/* eslint-disable @next/next/no-img-element -- the photo is uploaded or linked in the admin */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileText, Mail } from 'lucide-react';
import { DEFAULT_AVATAR } from '@/lib/profile-header';

type Key = 'home' | 'work' | 'cv' | 'contact' | 'about';

const keyForPath = (path: string): Key => {
  if (path === '/') return 'home';
  if (path.startsWith('/work')) return 'work';
  if (path.startsWith('/cv')) return 'cv';
  return 'about';
};

const HomeIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
    <path d="M3.5 10.5 12 3.5l8.5 7V20.5h-5.7v-6H9.2v6H3.5z" />
  </svg>
);

// The phone menu: a floating, see-through bar at the bottom, like the iPhone's.
// It shows where you are. Scrolling down shrinks it to the current icon; scrolling up
// or tapping it opens it again. Never shown in the admin or the private area.
const PhoneDock = ({ photo, name }: { photo: string; name: string }) => {
  const path = usePathname();
  const [section, setSection] = useState<Key>('home');
  const [mini, setMini] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    setMini(false);
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const moved = y - lastY.current;
      if (Math.abs(moved) > 6) {
        setMini(moved > 0 && y > 80);
        lastY.current = y;
      }
      if (y <= 80) setMini(false);

      if (path !== '/') return;
      // On the home page the highlight follows the section on screen.
      const reached = (id: string, share = 0.45) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top < window.innerHeight * share : false;
      };
      // Contact sits at the very end, so it counts as soon as it fills the lower part of the screen.
      const nearEnd = y > 80 && window.innerHeight + y >= document.documentElement.scrollHeight - 160;
      setSection(nearEnd || reached('contact', 0.7) ? 'contact' : reached('about') ? 'about' : reached('experience') ? 'work' : 'home');
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [path]);

  if (path.startsWith('/admin') || path.startsWith('/private')) return null;

  const active = path === '/' ? section : keyForPath(path);
  const items: { key: Key; label: string; href: string; icon: (on: boolean) => React.ReactNode }[] = [
    { key: 'home', label: 'Home', href: '/', icon: (on) => <HomeIcon filled={on} /> },
    { key: 'work', label: 'Work', href: '/#experience', icon: (on) => <Briefcase size={25} strokeWidth={on ? 2.5 : 1.9} aria-hidden /> },
    { key: 'cv', label: 'CV', href: '/cv', icon: (on) => <FileText size={25} strokeWidth={on ? 2.5 : 1.9} aria-hidden /> },
    { key: 'contact', label: 'Contact', href: '/#contact', icon: (on) => <Mail size={25} strokeWidth={on ? 2.5 : 1.9} aria-hidden /> },
    {
      key: 'about',
      label: 'About me',
      href: '/about',
      icon: (on) => (
        <span className={`block h-[29px] w-[29px] overflow-hidden rounded-full bg-surface-alt ${on ? 'ring-2 ring-primary' : ''}`}>
          <img src={photo} alt="" className={`h-full w-full object-cover ${photo === DEFAULT_AVATAR ? 'object-[50%_62%] scale-[1.4] origin-[44%_55%]' : ''}`} />
        </span>
      ),
    },
  ];

  return (
    <nav aria-label={`${name}: menu`} className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:hidden print:hidden">
      <ul className={`glass pointer-events-auto flex items-center rounded-full p-1.5 transition-all duration-500 motion-reduce:transition-none ${mini ? 'w-[66px]' : 'w-full'}`}>
        {items.map((item) => {
          const on = item.key === active;
          const folded = mini && !on;
          return (
            <li
              key={item.key}
              aria-hidden={folded || undefined}
              className={`min-w-0 transition-all duration-500 motion-reduce:transition-none ${folded ? 'w-0 flex-[0_0_0%] overflow-hidden opacity-0' : 'flex-[1_1_0%]'}`}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={on ? 'page' : undefined}
                tabIndex={folded ? -1 : undefined}
                onClick={(e) => {
                  if (mini) {
                    // a shrunk bar opens first
                    e.preventDefault();
                    setMini(false);
                  } else if (item.key === 'home' && path === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`flex h-[52px] items-center justify-center rounded-full text-primary ${on && !mini ? 'bg-glass-pick' : ''}`}>
                {item.icon(on)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default PhoneDock;

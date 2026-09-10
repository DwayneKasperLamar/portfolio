import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import Footer from '@/sections/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dwayne Kasper',
  description: 'Dwayne Kasper — software developer in Lagos, Nigeria. React, Next.js, TypeScript, Expo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" storageKey="portfolio-theme">
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

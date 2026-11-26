import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import Footer from '@/sections/Footer';
import PublicAnalytics from '@/components/PublicAnalytics';
import './globals.css';

const title = 'Dwayne Kasper — Software Architect';
const description =
  'Software architect in Nigeria. I design mobile and web products that take payments, and build them with AI. Open to remote roles.';

// The preview card shown when the link is pasted in a message or email. The picture is
// app/opengraph-image.png. Set NEXT_PUBLIC_SITE_URL when the site gets its own domain.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-dwayne.vercel.app'),
  title,
  description,
  openGraph: { type: 'website', siteName: 'Dwayne Kasper', title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" storageKey="portfolio-theme">
          {children}
          <Footer />
          <PublicAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

import Link from 'next/link';
import { cookies } from 'next/headers';
import MobileHeader from '@/components/MobileHeader';
import PhoneDock from '@/components/PhoneDock';
import { headerDetails } from '@/lib/profile-header';
import MessageForm from '@/components/MessageForm';
import EnquiryCard from '@/components/EnquiryCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import GalleryExperience from '@/components/gallery/Experience';
import { fromGalleryItems } from '@/components/gallery/media';
import { messagesReady } from '@/lib/messages';
import { enquiriesReady } from '@/lib/enquiries';
import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import Block from '@/components/Block';
import Experience from '@/components/Experience';
import TitledList from '@/components/TitledList';
import Offers from '@/components/Offers';
import CaseStudyList from '@/components/CaseStudyList';
import Quotes from '@/components/Quotes';
import ToolTiles from '@/components/ToolTiles';
import Contact from '@/components/Contact';
import EmailButton from '@/components/EmailButton';
import BodyText from '@/components/BodyText';
import { ADMIN_SESSION_COOKIE, isValidSession } from '@/lib/auth';
import { getProfile, getProjects, getPublicGalleryItems, getPublicList, getTechItems, LISTS } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [profile, projects, techItems, experience, caseStudies, ai, whatIDo, offers, quotes, contact, gallery, canMessage, canEnquire] = await Promise.all([
    getProfile(),
    getProjects(),
    getTechItems(),
    getPublicList(LISTS.experience),
    getPublicList(LISTS.caseStudies),
    getPublicList(LISTS.aiWorkflow),
    getPublicList(LISTS.whatIDo),
    getPublicList(LISTS.offers),
    getPublicList(LISTS.quotes),
    getPublicList(LISTS.contact),
    getPublicGalleryItems(),
    messagesReady(),
    enquiriesReady(),
  ]);

  if (!profile) {
    return (
      <main className="max-w-[640px] mx-auto px-6 pt-24 pb-8">
        <p className="text-muted">
          Content isn&rsquo;t set up yet &mdash; run <code>npm run seed</code> once Supabase credentials are in
          place.
        </p>
      </main>
    );
  }

  // Only changes a button label; no private content is loaded on this page.
  const owner = await isValidSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);

  // The WhatsApp link (set in Admin > Settings) gets a button; other contact links are rows.
  const isWhatsApp = (url: string | null) => Boolean(url?.startsWith('https://wa.me/'));
  const whatsapp = contact.find((c) => isWhatsApp(c.url))?.url;
  const contactRows = contact.filter((c) => !isWhatsApp(c.url));
  // The enquiry form replaces the message box once its database script has been run.
  const showForm = canEnquire || canMessage || owner;

  // The web menu jumps to sections of this page; each appears only if the section exists.
  const webLinks = [
    experience.length > 0 && { href: '/#experience', label: 'Work' },
    caseStudies.length > 0 && { href: '/#case-studies', label: 'Case studies' },
    ai.length > 0 && { href: '/#ai', label: 'How I work' },
    offers.length > 0 && { href: '/#services', label: 'Services' },
    gallery.length > 0 && { href: '/#gallery', label: 'Gallery' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ].filter((l): l is { href: string; label: string } => Boolean(l));

  // One page, two arrangements. The source order is the phone order; on the web the opening
  // comes first and the tool logos move up under it (md:order-*).
  return (
    <>
      <SiteHeader name={profile.name} email={profile.email} links={webLinks} />
      <main className="flex flex-col text-[15px]">
        <div className="md:hidden">
          <MobileHeader
            profile={profile}
            counts={{
              roles: experience.filter((e) => e.status?.toLowerCase() === 'current').length,
              caseStudies: caseStudies.length,
            }}
            owner={owner}
          />
        </div>
        <Hero profile={profile} className="md:order-1" />

        {experience.length > 0 && (
          <Block id="experience" label="Work experience" title="Where I have worked" className="md:order-3">
            <Experience items={experience} />
          </Block>
        )}
        {caseStudies.length > 0 && (
          <Block id="case-studies" label="Case studies" title="Problems and decisions" className="md:order-3">
            <CaseStudyList items={caseStudies} cards />
          </Block>
        )}
        {ai.length > 0 && (
          <Block id="ai" label="How I work with AI" title="AI does much of the typing. I make the decisions." className="md:order-3">
            <TitledList items={ai} layout="points" />
          </Block>
        )}

        {/* Phone: "What I do" then "Work with me". Web: the offers first, areas of work under them. */}
        <div id="services" className="flex flex-col md:order-3 md:scroll-mt-[68px]">
          {whatIDo.length > 0 && (
            <Block label="What I do" className="md:order-2 md:!pt-8 md:[&_h2]:hidden">
              <TitledList items={whatIDo} layout="areas" />
            </Block>
          )}
          {offers.length > 0 && (
            <Block label="Work with me" webLabel="Services" title="Work with me" className="md:order-1">
              <Offers items={offers} />
              {canEnquire ? (
                <Link href="/enquire" className="btn btn-fill mt-4 w-full md:mt-6 md:w-auto">
                  Start an enquiry
                </Link>
              ) : (
                <EmailButton email={profile.email} subject="Working together" className="mt-4 w-full md:hidden">
                  Email me about it
                </EmailButton>
              )}
            </Block>
          )}
        </div>

        {quotes.length > 0 && (
          <Block label="What people say" title="What people say" className="md:order-3 md:[&_.label]:hidden">
            <Quotes items={quotes} />
          </Block>
        )}

        {/* Visitors see the gallery once something in it is public; you also see the reminder. */}
        {(gallery.length > 0 || owner) && (
          <Block id="gallery" label="Gallery" title="Moments" className="md:order-3">
            {gallery.length > 0 ? (
              <GalleryExperience kind="gallery" moments={fromGalleryItems(gallery)} />
            ) : (
              <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">
                Only you can see this. Nothing in your gallery is public yet:{' '}
                <Link href="/admin/gallery" className="text-primary underline">
                  add photos or switch them to public
                </Link>
                .
              </p>
            )}
          </Block>
        )}

        <section id="about" className="px-5 pb-2 pt-8 scroll-mt-4 md:order-3 md:px-10 md:pb-24 md:pt-20 md:scroll-mt-[68px]">
          <div className="md:mx-auto md:grid md:max-w-[1080px] md:grid-cols-[260px_minmax(0,1fr)] md:gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-20">
            <h2 className="mb-[18px] md:mb-0">
              <span className="label block">About</span>
              <span className="mt-1.5 hidden font-head text-[34px] font-semibold leading-tight text-primary md:block">About me</span>
            </h2>
            <div>
              <BodyText text={profile.current_role_text} className="text-secondary md:text-lg" />
              <Link href="/about" className="mt-4 hidden text-sm font-medium text-primary underline decoration-line hover:decoration-primary md:inline-block">
                Story, books and projects &rarr;
              </Link>
            </div>
          </div>
        </section>

        {techItems.length > 0 && (
          <section aria-label="Tools" className="px-5 pb-2 pt-8 md:order-2 md:border-y md:border-line md:bg-surface md:px-10 md:py-7">
            <div className="md:mx-auto md:max-w-[1080px]">
              <h2 className="label mb-[18px] md:sr-only">Tools</h2>
              <ToolTiles items={techItems} projects={projects} className="grid-cols-5 lg:grid-cols-10" />
            </div>
          </section>
        )}

        {/* Web: a contrasting band that invites contact. */}
        <section id="contact" className="px-5 pb-2 pt-8 scroll-mt-4 md:order-4 md:bg-primary md:px-10 md:py-[72px] md:scroll-mt-[68px]">
          <div className="flex flex-col gap-4 md:mx-auto md:grid md:max-w-[1080px] md:grid-cols-[minmax(0,1fr)_minmax(0,440px)] md:grid-rows-[auto_1fr] md:items-start md:gap-x-10 md:gap-y-7 lg:gap-x-20">
            <div className="md:col-start-1 md:row-start-1">
              <h2>
                <span className="label block md:hidden">Contact</span>
                <span className="hidden text-balance font-head text-[40px] font-semibold leading-tight text-inverse md:block">
                  Tell me what you are building.
                </span>
              </h2>
              <p className="mt-3 hidden text-base text-inverse-muted md:block">Open to remote software architect roles and project work.</p>
            </div>

            {showForm && (
              <div className="md:col-start-2 md:row-span-2 md:row-start-1">
                {canEnquire ? (
                  <EnquiryCard />
                ) : canMessage ? (
                  <MessageForm />
                ) : (
                  <p className="rounded-2xl border border-dashed border-line bg-base p-4 text-sm text-muted">
                    Only you can see this. The message box appears for visitors once <code>supabase/004_messages.sql</code> has been run.
                  </p>
                )}
              </div>
            )}

            <div className={`grid gap-4 md:row-start-2 ${showForm ? 'md:col-start-1' : 'md:col-start-2 md:row-start-1'}`}>
              {whatsapp && <WhatsAppButton url={whatsapp} className="w-full text-primary md:w-auto md:justify-self-start md:text-inverse" />}
              <Contact profile={profile} extra={contactRows} />
            </div>
          </div>
        </section>

        {/* Web footer (phones use the site-wide one). */}
        <footer className="hidden px-10 md:order-5 md:block">
          <div className="mx-auto flex max-w-[1080px] justify-between gap-4 py-6 text-[13px] text-muted">
            <span>
              {profile.name} &middot; {profile.role_title}
            </span>
            <span className="flex gap-4">
              <Link href="/cv" className="hover:text-primary">
                CV
              </Link>
              <Link href="/about" className="hover:text-primary">
                About me
              </Link>
            </span>
          </div>
        </footer>
      </main>
      <PhoneDock photo={headerDetails(profile).avatar} name={profile.name} />
    </>
  );
}

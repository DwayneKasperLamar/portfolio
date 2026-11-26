// A home / CV section: small label, then content. `id` lets the menu jump to it.
const Section = ({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) => (
  <section id={id} className="mb-10 print:mb-4 scroll-mt-6">
    <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4 print:mb-1.5">{title}</h2>
    {children}
  </section>
);

export default Section;

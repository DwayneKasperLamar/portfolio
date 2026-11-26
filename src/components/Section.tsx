// A block on the CV and About pages: small label, then content.
const Section = ({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) => (
  <section id={id} className="mb-10 print:mb-4 scroll-mt-6">
    <h2 className="label mb-4 print:mb-1.5">{title}</h2>
    {children}
  </section>
);

export default Section;

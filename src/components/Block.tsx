// One section of the home page. Phone: a small label, then full-width content.
// Web: label plus a large heading, in the centred 1080px column.
const Block = ({
  id,
  label,
  webLabel,
  title,
  className = '',
  children,
}: {
  id?: string;
  label: string;
  /** A different small label for the web, when the web heading already says what the phone label says. */
  webLabel?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className={`px-5 pb-2 pt-8 scroll-mt-14 md:px-10 md:pb-0 md:pt-20 md:scroll-mt-[68px] ${className}`}>
    <div className="md:mx-auto md:max-w-[1080px]">
      <h2 className="mb-[18px] md:mb-8">
        <span className={`label block ${webLabel ? 'md:hidden' : ''}`}>{label}</span>
        {webLabel && <span className="label hidden md:block">{webLabel}</span>}
        {title && <span className="mt-1.5 hidden text-balance font-head text-[34px] font-semibold leading-tight text-primary md:block">{title}</span>}
      </h2>
      {children}
    </div>
  </section>
);

export default Block;

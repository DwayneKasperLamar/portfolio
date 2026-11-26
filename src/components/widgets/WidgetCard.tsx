// Shared frame so every widget looks like it belongs: same border, spacing, small label.
const WidgetCard = ({ label, href, wide, children }: { label: string; href?: string; wide?: boolean; children: React.ReactNode }) => (
  <div className={`border border-line rounded-lg p-4 bg-surface min-w-0 ${wide ? 'sm:col-span-2' : ''}`}>
    <p className="label mb-3 flex justify-between gap-3">
      <span>{label}</span>
      {href && (
        <a href={href} target="_blank" rel="noreferrer" className="normal-case tracking-normal hover:text-primary">
          open &rarr;
        </a>
      )}
    </p>
    {children}
  </div>
);

export default WidgetCard;

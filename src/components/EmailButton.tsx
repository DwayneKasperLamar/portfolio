const EmailButton = ({ email, subject, children = 'Email me' }: { email: string; subject?: string; children?: React.ReactNode }) => (
  <a
    href={`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`}
    className="inline-flex items-center justify-center rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary hover:bg-surface-alt transition-colors">
    {children}
  </a>
);

export default EmailButton;

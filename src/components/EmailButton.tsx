const EmailButton = ({
  email,
  subject,
  className = '',
  children = 'Email me',
}: {
  email: string;
  subject?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <a href={`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`} className={`btn btn-fill ${className}`}>
    {children}
  </a>
);

export default EmailButton;

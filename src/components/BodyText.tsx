// Renders plain text typed in the admin. Deliberately no HTML or markdown library: typed text
// can never inject markup. Three simple conventions, each as its own paragraph:
//   (blank line)        new paragraph
//   ## A heading        small heading
//   Flow: A | B | C     a diagram of steps, in order
const BodyText = ({ text, className = '' }: { text: string; className?: string }) => {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((p, i) => {
        if (p.startsWith('## ')) {
          return (
            <h2 key={i} className="label pt-3">
              {p.slice(3)}
            </h2>
          );
        }
        if (p.startsWith('Flow:')) {
          const steps = p.slice(5).split('|').map((s) => s.trim()).filter(Boolean);
          return (
            <ol key={i} className="flex flex-col items-start gap-1" aria-label="Steps, in order">
              {steps.map((step, j) => (
                <li key={j} className="flex flex-col items-start gap-1">
                  {j > 0 && (
                    <span aria-hidden className="pl-4 text-muted leading-none">
                      &darr;
                    </span>
                  )}
                  <span className="border border-line bg-surface rounded-md px-3 py-1.5 font-sans text-xs text-primary">{step}</span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        );
      })}
    </div>
  );
};

export default BodyText;

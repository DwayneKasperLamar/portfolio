// Renders plain text as paragraphs (blank line = new paragraph). Deliberately
// no HTML/markdown: text typed in the admin can never inject markup.
const BodyText = ({ text, className = '' }: { text: string; className?: string }) => {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-4 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
};

export default BodyText;

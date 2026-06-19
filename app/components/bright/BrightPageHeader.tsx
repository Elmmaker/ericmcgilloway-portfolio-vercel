/* Page-level header — eyebrow + big Inter title + optional muted intro.
   Used on Reels / Key Art / After Hours / LM at the top of the page,
   below the fixed Nav. */
export default function BrightPageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
}) {
  return (
    <header className="bright-page-head">
      {eyebrow && <div className="bright-page-eyebrow reveal">{eyebrow}</div>}
      <h1 className="bright-page-title reveal" data-d="1">
        {title}
      </h1>
      {intro && <p className="bright-page-intro reveal" data-d="2">{intro}</p>}
    </header>
  );
}

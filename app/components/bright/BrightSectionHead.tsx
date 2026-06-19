/* Section divider with a small mid-gray uppercase label and a thin
   1px rule extending to the right edge of the bright-skin max-width
   container. Used between major sections on every bright page. */
export default function BrightSectionHead({
  label,
  id,
}: {
  label: string;
  id?: string;
}) {
  return (
    <div className="bright-sec-head" id={id}>
      <span className="bright-sec-label">{label}</span>
      <div className="bright-sec-rule" />
    </div>
  );
}

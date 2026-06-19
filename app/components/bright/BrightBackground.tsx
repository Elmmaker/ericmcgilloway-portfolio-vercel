/* Fixed sky-blue gradient backdrop. Mounting this div triggers
   the body:has(.bright-bg) selector in globals.css which flips
   the dark default background to transparent so the gradient
   shows through. */
export default function BrightBackground() {
  return <div className="bright-bg" aria-hidden />;
}

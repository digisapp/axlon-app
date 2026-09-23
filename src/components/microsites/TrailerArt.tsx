/**
 * Stand-in for a model with no usable photo. A grey box with a truck icon read
 * as "broken"; a drawn lowboy in the site's accent reads as deliberate, and
 * the capacity line gives the card something a buyer actually scans for.
 */
export function TrailerArt({ label, className = '' }: { label?: string | null; className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${className}`}
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--ms-accent) 14%, #f8fafc), #eef2f7)',
      }}
    >
      <svg
        viewBox="0 0 240 70"
        aria-hidden="true"
        className="w-3/4 max-w-[260px]"
        style={{ color: 'color-mix(in srgb, var(--ms-accent) 70%, #0f172a)' }}
      >
        {/* gooseneck */}
        <path d="M6 22h38l10 14h8" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
        <path d="M6 22v-8h30v8" fill="currentColor" opacity=".85" />
        {/* well */}
        <path d="M60 36h118" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <path d="M178 36l10-10h46v12" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
        {/* wheels */}
        {[196, 214, 232].map((x) => (
          <circle key={x} cx={x - 4} cy="50" r="8" fill="currentColor" />
        ))}
        {[196, 214, 232].map((x) => (
          <circle key={`h${x}`} cx={x - 4} cy="50" r="3" fill="#f8fafc" />
        ))}
      </svg>
      {label && (
        <span
          className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            color: 'color-mix(in srgb, var(--ms-accent) 80%, #0f172a)',
            backgroundColor: 'color-mix(in srgb, var(--ms-accent) 12%, white)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

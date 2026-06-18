/**
 * Skeleton loading components untuk homepage.
 * Premium shimmer animation, no stale content.
 */

export function SkeletonText({
  width = "100%",
  height = "1rem",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded bg-muted/60 animate-pulse ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonBox({
  width = "100%",
  height = "100%",
  className = "",
  rounded = "rounded-md",
}: {
  width?: string;
  height?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <span
      className={`block ${rounded} bg-muted/60 animate-pulse ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/* ── Navbar skeleton: logo (square) + brand name (text) ── */
export function NavbarSkeleton() {
  return (
    <div className="flex items-center gap-2.5" aria-busy="true">
      <SkeletonBox width="2rem" height="2rem" rounded="rounded-lg" />
      <SkeletonText width="120px" height="1rem" />
    </div>
  );
}

/* ── Hero skeleton: badge + headline + subtitle + 2 CTAs ── */
export function HeroSkeleton() {
  return (
    <div className="max-w-2xl" aria-busy="true">
      {/* Badge */}
      <SkeletonBox width="280px" height="1.75rem" rounded="rounded-full" className="mb-7" />
      {/* Headline */}
      <SkeletonText width="100%" height="4rem" className="mb-3" />
      <SkeletonText width="85%" height="4rem" className="mb-3" />
      <SkeletonText width="65%" height="4rem" className="mb-6" />
      {/* Subtitle */}
      <SkeletonText width="100%" height="1.125rem" className="mb-2" />
      <SkeletonText width="90%" height="1.125rem" className="mb-2" />
      <SkeletonText width="70%" height="1.125rem" className="mb-10" />
      {/* CTAs */}
      <div className="flex gap-3">
        <SkeletonBox width="180px" height="3.25rem" rounded="rounded-xl" />
        <SkeletonBox width="160px" height="3.25rem" rounded="rounded-xl" />
      </div>
    </div>
  );
}

/* ── Generic section skeleton ── */
export function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 py-8" aria-busy="true">
      <SkeletonText width="40%" height="2rem" className="mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonText
          key={i}
          width={i === lines - 1 ? "60%" : "100%"}
          height="1rem"
        />
      ))}
    </div>
  );
}

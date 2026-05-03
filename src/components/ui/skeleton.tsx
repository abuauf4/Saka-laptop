import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton-shimmer rounded-xl", className)}
      {...props}
    />
  );
}

/* ── Preset skeleton layouts ── */

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("card-base overflow-hidden", className)}>
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full mt-2 rounded-xl" />
      </div>
    </div>
  );
}

function SkeletonProductRow({ className }: { className?: string }) {
  return (
    <div className={cn("card-base p-4 flex items-center gap-3", className)}>
      <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-9 w-20 rounded-lg" />
    </div>
  );
}

function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={cn("card-base p-4 sm:p-5 space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

function SkeletonTransaction({ className }: { className?: string }) {
  return (
    <div className={cn("card-base p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}

/* ── Page header skeleton ── */
function SkeletonPageHeader({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

/* ── Grid skeleton wrapper ── */
function SkeletonGrid({ children, className, columns = 3 }: { children: React.ReactNode; className?: string; columns?: number }) {
  const colsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn("grid gap-4", colsClass, className)}>
      {children}
    </div>
  );
}

/* ── Generic line placeholder ── */
function SkeletonLine({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

/* ── Finder card skeleton ── */
function SkeletonFinderCard({ className }: { className?: string }) {
  return (
    <div className={cn("card-base overflow-hidden", className)}>
      <div className="bg-gradient-to-r from-muted/20 to-transparent px-5 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-1 w-full rounded-full" />
      </div>
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonProductRow, SkeletonStats, SkeletonTransaction, SkeletonPageHeader, SkeletonGrid, SkeletonLine, SkeletonFinderCard };

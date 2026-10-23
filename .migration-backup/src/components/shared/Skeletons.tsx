export function ListingCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-white/5" />
      <div className="p-3.5 space-y-3">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="h-3 bg-white/5 rounded w-1/3" />
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="h-5 bg-white/5 rounded w-24" />
          <div className="h-7 bg-white/5 rounded w-8" />
        </div>
      </div>
    </div>
  );
}

export function StoreCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/5 rounded w-3/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-white/5 rounded w-2/3 mt-4" />
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <div className="h-3 bg-white/5 rounded w-16" />
        <div className="h-7 bg-white/5 rounded w-12" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-white/5 mb-3" />
      <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="animate-pulse py-16">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="h-10 bg-white/5 rounded w-2/3 mx-auto" />
        <div className="h-5 bg-white/5 rounded w-1/2 mx-auto" />
        <div className="h-14 bg-white/5 rounded max-w-xl mx-auto mt-8" />
      </div>
    </div>
  );
}

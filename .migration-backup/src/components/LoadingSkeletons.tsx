import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

/**
 * Generic loading skeleton for product cards
 */
export const ProductCardSkeleton = memo(() => (
  <div className="border rounded-lg p-4 space-y-3">
    <Skeleton className="h-48 w-full rounded-md" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
));

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

/**
 * Loading skeleton for product grid
 */
export const ProductGridSkeleton = memo(({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
));

ProductGridSkeleton.displayName = 'ProductGridSkeleton';

/**
 * Loading skeleton for details page
 */
export const ProductDetailsSkeleton = memo(() => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </div>
    </div>
  </div>
));

ProductDetailsSkeleton.displayName = 'ProductDetailsSkeleton';

/**
 * Loading skeleton for store card
 */
export const StoreCardSkeleton = memo(() => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-20 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
  </div>
));

StoreCardSkeleton.displayName = 'StoreCardSkeleton';

/**
 * Loading skeleton for navigation
 */
export const NavigationSkeleton = memo(() => (
  <div className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>
      </div>
    </div>
  </div>
));

NavigationSkeleton.displayName = 'NavigationSkeleton';

/**
 * Loading skeleton for list page
 */
export const ListPageSkeleton = memo(() => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <div className="border rounded-lg p-4 space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>
      <main className="lg:col-span-3">
        <div className="mb-6 flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <ProductGridSkeleton count={9} />
      </main>
    </div>
  </div>
));

ListPageSkeleton.displayName = 'ListPageSkeleton';

/**
 * Loading skeleton for dashboard
 */
export const DashboardSkeleton = memo(() => (
  <div className="container mx-auto px-4 py-8">
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';

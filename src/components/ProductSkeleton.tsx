import { Skeleton } from "@/components/ui/skeleton";

export const ProductSkeleton = () => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 h-full">
      <div className="aspect-square">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-3 md:p-5 space-y-3">
        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-3 md:h-4 md:w-4" />
          ))}
        </div>
        {/* Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        {/* Price */}
        <Skeleton className="h-8 w-1/3" />
        {/* Button */}
        <Skeleton className="h-9 md:h-10 w-full rounded-full" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

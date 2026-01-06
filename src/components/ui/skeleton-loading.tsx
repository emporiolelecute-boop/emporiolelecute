import { Skeleton } from "@/components/ui/skeleton";

export const PageSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-20 border-b border-border">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Skeleton className="w-32 h-10" />
        <div className="flex gap-4">
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-20 h-6" />
        </div>
      </div>
    </div>
    <main className="container mx-auto px-4 py-8">
      <Skeleton className="w-64 h-10 mb-6" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <Skeleton className="aspect-square" />
            <div className="p-4 space-y-3">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-8" />
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export const ProductSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-20 border-b border-border" />
    <main className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-6">
          <Skeleton className="w-3/4 h-10" />
          <Skeleton className="w-1/2 h-8" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      </div>
    </main>
  </div>
);

export const AdminSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="w-48 h-10" />
      <Skeleton className="w-32 h-10" />
    </div>
    <div className="grid gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/3 h-5" />
            <Skeleton className="w-1/2 h-4" />
          </div>
          <Skeleton className="w-20 h-8" />
        </div>
      ))}
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-border">
    <Skeleton className="aspect-square" />
    <div className="p-4 space-y-3">
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-8" />
    </div>
  </div>
);

export function ProductCardSkeleton() {
  return (
    <div className="w-[300px] border border-gray-300 rounded-lg p-4 shadow animate-pulse">
      <div className="bg-gray-300 h-40 mb-4 rounded" />
      <div className="h-6 bg-gray-300 mb-2 rounded w-3/4" />
      <div className="h-4 bg-gray-300 mb-2 rounded w-1/2" />
      <div className="h-8 bg-gray-300 rounded w-full" />
    </div>
  );
}

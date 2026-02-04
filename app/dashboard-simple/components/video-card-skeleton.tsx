"use client";

export function VideoCardSkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-none h-full">
      <div className="aspect-video bg-gray-100 animate-pulse" />
      <div className="p-5 space-y-4">
        <div className="h-7 bg-gray-100 animate-pulse rounded-md w-3/4" />
        <div className="h-4 bg-gray-50 animate-pulse rounded-md w-full" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-100 animate-pulse rounded-full w-20" />
          <div className="h-6 bg-gray-100 animate-pulse rounded-md w-16" />
        </div>
        <div className="h-10 bg-gray-50 animate-pulse rounded-[20px] w-full mt-4" />
      </div>
    </div>
  );
}

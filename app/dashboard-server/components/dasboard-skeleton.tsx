function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-[20px] border border-gray-100 overflow-hidden h-[400px]">
          <div className="aspect-video bg-gray-200" />
          <div className="p-5 space-y-4">
            <div className="h-8 bg-gray-200 rounded-md w-3/4" />
            <div className="h-4 bg-gray-100 rounded-md w-full" />
            <div className="h-10 bg-gray-50 rounded-full w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
export default function DashboardLoading() {
  return (
    <div className="page-container animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-32 bg-gray-800 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-800/60 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
        <div className="h-32 bg-gray-800/60 rounded-2xl" />
        <div className="h-32 bg-gray-800/60 rounded-2xl" />
      </div>
      <div className="h-48 bg-gray-800/60 rounded-2xl mb-6" />
      <div className="h-40 bg-gray-800/60 rounded-2xl" />
    </div>
  );
}

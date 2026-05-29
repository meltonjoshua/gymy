export default function AnalyticsLoading() {
  return (
    <div className="page-container animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-28 bg-gray-800 rounded-lg" />
        <div className="h-3 w-40 bg-gray-800/60 rounded mt-2" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-800/60 rounded-xl" />
        ))}
      </div>
      <div className="h-12 bg-gray-800/40 rounded-xl mb-6" />
      <div className="h-52 bg-gray-800/60 rounded-xl mb-4" />
      <div className="h-40 bg-gray-800/60 rounded-xl" />
    </div>
  );
}

export default function ExercisesLoading() {
  return (
    <div className="page-container animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-44 bg-gray-800 rounded-lg" />
        <div className="h-3 w-24 bg-gray-800/60 rounded mt-2" />
      </div>
      <div className="h-12 bg-gray-800/60 rounded-xl mb-4" />
      <div className="h-10 bg-gray-800/40 rounded-xl mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-800/60 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

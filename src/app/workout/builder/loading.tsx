export default function WorkoutLoading() {
  return (
    <div className="page-container animate-pulse">
      <div className="h-9 w-48 bg-gray-800 rounded-lg mb-4" />
      <div className="h-20 bg-gray-800/60 rounded-xl mb-4" />
      <div className="h-16 bg-gray-800/40 rounded-xl mb-4" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-800/60 rounded-xl mb-3" />
      ))}
    </div>
  );
}

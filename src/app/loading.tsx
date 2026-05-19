export default function HomeLoading() {
  return (
    <div className="page-container animate-pulse">
      <div className="mb-8">
        <div className="h-9 w-48 bg-gray-800 rounded-lg" />
        <div className="h-4 w-32 bg-gray-800/60 rounded mt-2" />
      </div>
      <div className="flex gap-3 mb-8">
        <div className="flex-1 h-12 bg-gray-800 rounded-xl" />
        <div className="h-12 w-24 bg-gray-800 rounded-xl" />
      </div>
      <div className="h-24 bg-gray-800/60 rounded-2xl mb-6" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="h-24 bg-gray-800/60 rounded-2xl" />
        <div className="h-24 bg-gray-800/60 rounded-2xl" />
        <div className="h-24 bg-gray-800/60 rounded-2xl" />
      </div>
      <div className="h-48 bg-gray-800/60 rounded-2xl mb-6" />
      <div className="h-36 bg-gray-800/60 rounded-2xl mb-6" />
      <div className="h-40 bg-gray-800/60 rounded-2xl mb-6" />
      <div className="h-32 bg-gray-800/60 rounded-2xl" />
    </div>
  );
}

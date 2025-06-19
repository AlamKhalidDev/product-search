export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    </main>
  );
}

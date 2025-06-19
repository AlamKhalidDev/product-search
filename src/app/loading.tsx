import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex items-center space-x-3 animate-pulse">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-xl font-semibold text-gray-700">
          Loading...
        </span>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-6xl">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow animate-pulse flex flex-col gap-3"
          >
            <div className="h-40 bg-gray-200 rounded-lg" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

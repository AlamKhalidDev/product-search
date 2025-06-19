"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold text-red-600">
        Something went wrong
      </h2>
      <p className="text-gray-600">{error.message}</p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}

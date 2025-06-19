"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Product page error:", error);
  }, [error]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-center h-[70vh]">
      <h1 className="text-2xl font-semibold text-red-600 mb-4">
        Something went wrong
      </h1>
      <p className="mb-6 text-gray-700">
        We couldn&apos;t load the product. Please try again later.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
      >
        Try again
      </button>
      <div className="mt-4">
        <button
          onClick={() => router.push("/")}
          className="text-blue-500 underline hover:text-blue-600 cursor-pointer"
        >
          Go back to search
        </button>
      </div>
    </main>
  );
}

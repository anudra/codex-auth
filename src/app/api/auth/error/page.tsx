"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error = params.get("error") || "Unknown";
  const router = useRouter();

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Authentication Failed</h1>
      <p className="mb-6">Reason: {error}</p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go Home
      </button>
    </main>
  );
}
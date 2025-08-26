"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // For now, always redirect to landing page since backend is not yet migrated
    router.replace("/landing");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading CEMSE Platform...</p>
      </div>
    </div>
  );
}

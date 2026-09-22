"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="container py-20 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-neutral-500">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <Button variant="brand" className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function MockDataAlert() {
  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <AlertCircle className="h-4 w-4 text-blue-500" />
      <AlertDescription className="text-blue-700">
        You&apos;re currently viewing demonstration data. Upload your evaluations or connect your API to see your real data.
      </AlertDescription>
    </Alert>
  );
}
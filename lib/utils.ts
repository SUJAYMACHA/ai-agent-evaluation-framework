import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function obfuscateText(text: string): string {
  // Simple obfuscation - replace everything except first and last 10 characters
  if (text.length <= 20) {
    return "***";
  }
  const start = text.substring(0, 10);
  const end = text.substring(text.length - 10);
  return `${start}${"*".repeat(text.length - 20)}${end}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString();
}

export function calculateSuccessRate(evaluations: { flags: any }[]): number {
  if (evaluations.length === 0) return 0;
  const successfulEvals = evaluations.filter(
    (e) => !e.flags || (Array.isArray(e.flags) && !e.flags.includes("failed"))
  );
  return (successfulEvals.length / evaluations.length) * 100;
}

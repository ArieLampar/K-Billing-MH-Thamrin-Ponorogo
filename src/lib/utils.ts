import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTeachingLevel(level: string | null | undefined): "BAWAH" | "TENGAH" | "ATAS" {
  if (!level) return "BAWAH"; // Default
  const l = level.toUpperCase();
  // Bawah: 7A - A
  if (l.includes("A") || l.match(/^\d+[A-Z]$/)) return "BAWAH";
  // Tengah: B - F
  if (["B", "C", "D", "E", "F"].some(c => l.startsWith(c))) return "TENGAH";
  // Atas: G - O
  return "ATAS";
}

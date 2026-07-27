import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIQD(amount: number): string {
  return new Intl.NumberFormat("en-US").format(amount) + " د.ع"
}

export const MATERIALS = [
  { key: "original", label: "ئەسڵ" },
  { key: "medium", label: "مامناوەند" },
  { key: "normal", label: "عادی" },
] as const

export type MaterialKey = (typeof MATERIALS)[number]["key"]

export const ORDER_STATUSES = [
  { key: "pending", label: "چاوەڕوانی", color: "bg-chart-3/15 text-chart-3" },
  { key: "confirmed", label: "پەسەندکراو", color: "bg-primary/15 text-primary" },
  { key: "shipped", label: "نێردراو", color: "bg-chart-5/15 text-chart-5" },
  { key: "completed", label: "تەواوبوو", color: "bg-success/15 text-success" },
  { key: "cancelled", label: "هەڵوەشاوە", color: "bg-destructive/15 text-destructive" },
] as const

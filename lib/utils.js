import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function formatDueDate(dateString, isDone = false) {
  if (!dateString) return null;
  
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  
  const [year, month, day] = parts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  const d = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isDone) {
    return { label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), type: "default" };
  }

  const diffTime = d.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { label: "Overdue", type: "overdue" };
  if (diffDays === 0) return { label: "Due today", type: "today" };
  if (diffDays === 1) return { label: "Tomorrow", type: "tomorrow" };
  
  return { label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), type: "default" };
}

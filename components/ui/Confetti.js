"use client";
import confetti from "canvas-confetti";

export function Confetti() {
  return null;
}

export const triggerTaskDoneConfetti = (e) => {
  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
  }

  const rect = e?.target?.getBoundingClientRect();
  const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
  const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

  confetti({
    particleCount: 40,
    spread: 60,
    origin: { x, y },
    colors: ["#10B981", "#6366F1", "#A1A1AA", "#3F3F46"],
    ticks: 100,
    gravity: 1.2,
    scalar: 0.7,
  });
};

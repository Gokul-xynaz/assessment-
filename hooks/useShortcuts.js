"use client";
import { useEffect } from "react";

export function useShortcuts({ onNewTask, onSearchFocus, onEscape }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputFocused =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

      if (e.key === "Escape" && onEscape) {
        onEscape();
        return;
      }

      if (isInputFocused) return;

      if (e.key.toLowerCase() === "n" && onNewTask) {
        e.preventDefault();
        onNewTask();
      }

      if (e.key === "/" && onSearchFocus) {
        e.preventDefault();
        onSearchFocus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewTask, onSearchFocus, onEscape]);
}

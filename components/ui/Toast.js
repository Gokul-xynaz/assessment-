"use client";
import { useTasks } from "@/hooks/useTasks";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, X } from "lucide-react";

export function Toast() {
  const { showUndo, undoDelete } = useTasks();

  return (
    <AnimatePresence>
      {showUndo && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-zinc-900 dark:bg-dark-card text-white px-4 py-3 rounded-xl shadow-xl border border-zinc-800"
        >
          <span className="text-[13px] font-medium text-zinc-100">Task deleted</span>
          <button
            onClick={undoDelete}
            className="flex items-center gap-1.5 text-[13px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <RotateCcw size={14} />
            Undo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

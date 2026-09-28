"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // We could log the error to an error reporting service here
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-[#111113] p-4 text-center">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 max-w-md w-full shadow-sm flex flex-col items-center">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 font-display tracking-[-0.01em]">
          Something went wrong
        </h2>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
          We encountered an unexpected error. Your data should be safe in local storage.
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
        >
          <RefreshCcw size={16} />
          Reset board
        </button>
      </div>
    </div>
  );
}

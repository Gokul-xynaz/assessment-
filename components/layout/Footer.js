export function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 font-mono text-[10px] uppercase">N</kbd> New task
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 font-mono text-[10px] uppercase">/</kbd> Search
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 font-mono text-[10px] uppercase">Esc</kbd> Close
          </span>
        </div>
      </div>
    </footer>
  );
}

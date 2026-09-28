"use client";
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Plus, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTasks } from "@/hooks/useTasks";
import { PRIORITIES } from "@/lib/columns";
import { cn } from "@/lib/utils";
import debounce from "lodash.debounce";

export function Header({ onNewTask }) {
  const { tasks, searchQuery, setSearchQuery, priorityFilter, setPriorityFilter, isHydrated } = useTasks();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const debouncedSetSearch = useMemo(
    () => debounce((val) => setSearchQuery(val), 300),
    [setSearchQuery]
  );

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  return (
    <header className="sticky top-0 z-30 bg-zinc-50 dark:bg-dark-bg border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-6 min-w-max">
          <h1 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100 tracking-[-0.01em]">Stacks</h1>
          {isHydrated && totalTasks > 0 && (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">{doneTasks} of {totalTasks} done</span>
              <div className="w-16 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-[480px] px-2 hidden sm:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={localSearch}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-card border border-zinc-200 dark:border-zinc-800 rounded-lg text-[13px] transition-all outline-none text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 min-w-max">
          <div className="hidden lg:flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setPriorityFilter(null)}
              className={cn("px-3 py-1 text-[13px] font-medium rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", priorityFilter === null ? "bg-white dark:bg-dark-card shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300")}
            >
              All
            </button>
            {PRIORITIES.map(p => (
              <button
                key={p.id}
                onClick={() => setPriorityFilter(priorityFilter === p.id ? null : p.id)}
                className={cn("px-3 py-1 text-[13px] font-medium rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500", priorityFilter === p.id ? "bg-white dark:bg-dark-card shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300")}
              >
                {p.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onNewTask}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg"
            >
              <Plus size={16} />
              <span className="hidden sm:block">New task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  onNewTask: PropTypes.func.isRequired,
};

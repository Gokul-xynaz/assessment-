import { PRIORITIES } from "@/lib/columns";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

export function PriorityBadge({ priorityId }) {
  if (!priorityId) return null;
  const config = PRIORITIES.find((p) => p.id === priorityId);
  if (!config) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-[12px] font-medium text-zinc-600 dark:text-zinc-400">
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </div>
  );
}

PriorityBadge.propTypes = {
  priorityId: PropTypes.string,
};

import { CheckSquare, CircleDashed, CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";

export function EmptyState({ columnId }) {
  const content = {
    "todo": {
      title: "Add a task to get started",
      icon: <CheckSquare size={24} className="mb-2 opacity-40" />
    },
    "in-progress": {
      title: "Nothing in progress",
      icon: <CircleDashed size={24} className="mb-2 opacity-40" />
    },
    "done": {
      title: "No completed tasks",
      icon: <CheckCircle2 size={24} className="mb-2 opacity-40" />
    }
  };

  const current = content[columnId] || content["todo"];

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-32 text-zinc-500 dark:text-zinc-400">
      {current.icon}
      <h4 className="text-[13px] font-medium opacity-90">{current.title}</h4>
    </div>
  );
}

EmptyState.propTypes = {
  columnId: PropTypes.string.isRequired,
};

"use client";
import { useSortable } from "@dnd-kit/sortable";
import PropTypes from "prop-types";
import { CSS } from "@dnd-kit/utilities";
import { useTasks } from "@/hooks/useTasks";
import { PriorityBadge } from "./PriorityBadge";
import { cn, formatDueDate } from "@/lib/utils";
import { GripVertical, Edit2, Trash2, Calendar, CheckCircle2, MoreHorizontal } from "lucide-react";
import { COLUMNS } from "@/lib/columns";
import { motion, AnimatePresence } from "framer-motion";

export function TaskCard({ task, onEdit }) {
  const { deleteTask, moveTask } = useTasks();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleMove = (e, newStatus) => {
    e.stopPropagation();
    moveTask(task.id, newStatus);
  };

  const isDone = task.status === "done";
  const dateInfo = formatDueDate(task.dueDate, isDone);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col gap-3 bg-white dark:bg-dark-card rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 transition-all duration-200",
        isDragging ? "opacity-50 scale-[1.02] z-50 shadow-xl" : "hover:-translate-y-[1px] hover:shadow-sm",
        isDone && "bg-zinc-50 dark:bg-zinc-900/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <AnimatePresence>
              {isDone && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-[2px] text-zinc-400 shrink-0"
                >
                  <CheckCircle2 size={16} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative break-words overflow-hidden">
              <h3 className={cn(
                "font-medium text-[15px] text-zinc-900 dark:text-zinc-100 leading-tight transition-colors tracking-[-0.01em]",
                isDone && "text-zinc-500 dark:text-zinc-500"
              )}>
                {task.title}
              </h3>
              {isDone && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute left-0 top-1/2 h-[1px] bg-zinc-400 dark:bg-zinc-600"
                />
              )}
            </div>
          </div>
          {task.description && (
            <p className={cn("mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-snug", isDone && "opacity-75")}>
              {task.description}
            </p>
          )}
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity rounded focus-visible:opacity-100 outline-none"
        >
          <GripVertical size={16} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priorityId={task.priority} />
          {dateInfo && (
            <div className={cn(
              "flex items-center gap-1 text-[12px] font-medium",
              dateInfo.type === 'overdue' ? "text-red-600 dark:text-red-400" :
              dateInfo.type === 'today' ? "text-amber-600 dark:text-amber-500" :
              "text-zinc-500 dark:text-zinc-400"
            )}>
              <Calendar size={12} />
              <span>{dateInfo.label}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <div className="relative group/menu">
            <button className="p-1.5 text-zinc-400 hover:text-indigo-500 transition-colors rounded peer focus:outline-none" aria-label="Move task">
              <MoreHorizontal size={14} />
            </button>
            <div className="absolute right-0 bottom-full mb-1 hidden group-hover/menu:flex peer-focus:flex hover:flex flex-col bg-white dark:bg-dark-card shadow-lg border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 z-10 w-32">
              <span className="text-[10px] font-medium text-zinc-400 px-2 py-1">Move to</span>
              {COLUMNS.map(col => (
                <button
                  key={col.id}
                  onClick={(e) => handleMove(e, col.id)}
                  disabled={col.id === task.status}
                  className="text-[12px] text-left px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-zinc-400 hover:text-indigo-500 transition-colors rounded"
            aria-label="Edit task"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string,
    dueDate: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

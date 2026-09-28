"use client";
import { useDroppable } from "@dnd-kit/core";
import PropTypes from "prop-types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "@/components/task/TaskCard";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function Column({ column, tasks, onEditTask }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const [prevCount, setPrevCount] = useState(tasks.length);
  const countRef = useRef(null);

  useEffect(() => {
    if (tasks.length !== prevCount) {
      if (countRef.current) {
        countRef.current.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.3)" },
            { transform: "scale(1)" },
          ],
          { duration: 300, easing: "ease-out" }
        );
      }
      setPrevCount(tasks.length);
    }
  }, [tasks.length, prevCount]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-card rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[15px] flex items-center gap-2 text-zinc-900 dark:text-zinc-100 tracking-[-0.01em]">
            <span className={cn("w-2 h-2 rounded-full", column.dot)}></span>
            {column.title}
          </h2>
          <span
            ref={countRef}
            className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-4 overflow-y-auto transition-colors flex flex-col gap-4 min-h-[200px]",
          isOver && "bg-zinc-50/50 dark:bg-zinc-900/50"
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard task={task} onEdit={onEditTask} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>
        
        {tasks.length === 0 && <EmptyState columnId={column.id} />}
      </div>
    </div>
  );
}

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    dot: PropTypes.string,
  }).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditTask: PropTypes.func.isRequired,
};

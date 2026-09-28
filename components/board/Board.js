"use client";
import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { TaskCard } from "@/components/task/TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { COLUMNS } from "@/lib/columns";
import { triggerTaskDoneConfetti } from "@/components/ui/Confetti";

import { Plus, CheckCircle2, SearchX } from "lucide-react";

export function Board({ onEditTask, onNewTask }) {
  const { tasks, moveTask, searchQuery, priorityFilter, setPriorityFilter, setSearchQuery, isHydrated } = useTasks();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = task.title.toLowerCase().includes(query) || 
                            (task.description && task.description.toLowerCase().includes(query));
      const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  const onDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const onDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    let newStatus;
    
    if (isOverColumn) {
      newStatus = overId;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus && activeTask && activeTask.status !== newStatus) {
      moveTask(taskId, newStatus);
      if (newStatus === "done") {
        triggerTaskDoneConfetti({ target: document.body });
      }
    }
  };

  if (!isHydrated) {
    return <div className="flex-1" />;
  }

  const allDone = tasks.length > 0 && tasks.every((t) => t.status === "done");

  if (allDone) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-[-0.01em]">Board Cleared!</h2>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">Great job! You&apos;ve completed all your tasks. Enjoy your free time or add a new one when you&apos;re ready.</p>
        <button
          onClick={onNewTask}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>
    );
  }

  if (tasks.length > 0 && filteredTasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mb-6">
          <SearchX size={32} />
        </div>
        <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-[-0.01em]">No tasks found</h2>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">We couldn&apos;t find any tasks matching your filters.</p>
        <button
          onClick={() => { setSearchQuery(""); setPriorityFilter(null); }}
          className="text-[13px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex-1 overflow-x-auto p-4 md:p-8">
        <div className="max-w-[1200px] mx-auto h-full min-h-[60vh] flex flex-col md:flex-row gap-6">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex-1 min-w-[300px]">
              <Column
                column={col}
                tasks={filteredTasks.filter((t) => t.status === col.id)}
                onEditTask={onEditTask}
              />
            </div>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onEdit={() => {}} /> : null}
      </DragOverlay>

      <button
        onClick={onNewTask}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 active:scale-90 transition-transform z-40"
        aria-label="New Task"
      >
        <Plus size={24} />
      </button>
    </DndContext>
  );
}

Board.propTypes = {
  onEditTask: PropTypes.func.isRequired,
  onNewTask: PropTypes.func.isRequired,
};

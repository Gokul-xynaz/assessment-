"use client";
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useTasks } from "@/hooks/useTasks";
import { PRIORITIES } from "@/lib/columns";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import FocusLock from "react-focus-lock";
import { MAX_TITLE_LENGTH, MAX_DESC_LENGTH } from "@/lib/constants";

export function TaskModal({ isOpen, onClose, editingTask = null }) {
  const { addTask, updateTask, tasks } = useTasks();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleClose = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // Populate data
  useEffect(() => {
    if (isOpen) {
      setTitle(editingTask?.title || "");
      setDescription(editingTask?.description || "");
      setPriority(editingTask?.priority || "");
      setDueDate(editingTask?.dueDate || "");
      setError("");
    }
  }, [isOpen, editingTask]);

  // Handle task missing while editing (e.g. deleted in another tab)
  useEffect(() => {
    if (isOpen && editingTask) {
      const stillExists = tasks.find((t) => t.id === editingTask.id);
      if (!stillExists) {
        handleClose();
      }
    }
  }, [tasks, isOpen, editingTask, handleClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    const taskData = {
      title: trimmedTitle.substring(0, MAX_TITLE_LENGTH),
      description: description.trim().substring(0, MAX_DESC_LENGTH),
      priority,
      dueDate,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusLock returnFocus>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-md bg-white dark:bg-dark-card rounded-xl shadow-xl pointer-events-auto flex flex-col max-h-[90vh] border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800/50">
                <h2 id="modal-title" className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-[-0.01em]">
                  {editingTask ? "Edit Task" : "New Task"}
                </h2>
                <button
                  onClick={handleClose}
                  aria-label="Close dialog"
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto">
                <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      autoFocus
                      maxLength={MAX_TITLE_LENGTH}
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (error) setError("");
                      }}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-dark-bg border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all text-[13px] text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                      placeholder="What needs to be done?"
                    />
                    {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Description <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      maxLength={MAX_DESC_LENGTH}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-dark-bg border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all resize-none text-[13px] text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                      placeholder="Add details..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="priority" className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Priority
                      </label>
                      <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 dark:bg-dark-bg border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all text-[13px] text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <option value="">None</option>
                        {PRIORITIES.map((p) => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dueDate" className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Due Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 w-[14px] h-[14px] pointer-events-none" />
                        <input
                          id="dueDate"
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-zinc-50 dark:bg-dark-bg border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none transition-all text-[13px] text-zinc-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-5 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end gap-3 rounded-b-xl">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="task-form"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card outline-none"
                >
                  {editingTask ? "Save" : "Add task"}
                </button>
              </div>
            </motion.div>
          </div>
        </FocusLock>
      )}
    </AnimatePresence>
  );
}

TaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editingTask: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    priority: PropTypes.string,
    dueDate: PropTypes.string,
    status: PropTypes.string,
  }),
};

"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import { STORAGE_KEY, STORAGE_VERSION, TOAST_DURATION } from "@/lib/constants";

const TasksContext = createContext(undefined);

const SAMPLE_TASKS = [
  { id: "1", title: "Review pull requests", status: "todo", priority: "high", createdAt: new Date().toISOString() },
  { id: "2", title: "Update documentation", status: "in-progress", priority: "medium", createdAt: new Date().toISOString() },
  { id: "3", title: "Fix header alignment", status: "done", priority: "low", createdAt: new Date().toISOString() }
];

const isValidTask = (task) => {
  return (
    task &&
    typeof task === "object" &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.status === "string"
  );
};

export function TasksProvider({ children }) {
  const [storageData, setStorageData, isHydrated] = useLocalStorage(STORAGE_KEY, { version: STORAGE_VERSION, tasks: SAMPLE_TASKS });
  
  // Validate and normalize tasks on load
  const validTasks = (Array.isArray(storageData?.tasks) ? storageData.tasks : [])
    .filter(isValidTask)
    .map(t => ({
       ...t,
       title: t.title.substring(0, 80),
       description: t.description ? String(t.description).substring(0, 300) : "",
    }));

  const setTasks = (action) => {
    setStorageData((prev) => {
      const prevTasks = Array.isArray(prev?.tasks) ? prev.tasks : [];
      const newTasks = action instanceof Function ? action(prevTasks) : action;
      return { version: STORAGE_VERSION, tasks: newTasks };
    });
  };

  const tasks = validTasks;

  const [deletedTasksQueue, setDeletedTasksQueue] = useState([]);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(null);

  const addTask = (taskData) => {
    const newTask = {
      id: generateId(),
      status: "todo",
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const moveTask = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;
    
    setDeletedTasksQueue((prev) => [...prev, taskToDelete]);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const undoDelete = () => {
    setDeletedTasksQueue((prev) => {
      if (prev.length === 0) return prev;
      const lastDeleted = prev[prev.length - 1];
      setTasks((currentTasks) => [...currentTasks, lastDeleted]);
      return prev.slice(0, -1);
    });
  };

  const showUndo = deletedTasksQueue.length > 0;

  useEffect(() => {
    let timer;
    if (showUndo) {
      timer = setTimeout(() => {
        setDeletedTasksQueue((prev) => prev.slice(1));
      }, TOAST_DURATION);
    }
    return () => clearTimeout(timer);
  }, [deletedTasksQueue, showUndo]);

  const clearBoard = () => {
    setTasks([]);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isHydrated,
        addTask,
        updateTask,
        moveTask,
        deleteTask,
        undoDelete,
        showUndo,
        clearBoard,
        searchQuery,
        setSearchQuery,
        priorityFilter,
        setPriorityFilter
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}

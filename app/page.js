"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Board } from "@/components/board/Board";
import { TaskModal } from "@/components/task/TaskModal";
import { useShortcuts } from "@/hooks/useShortcuts";
import { useTasks } from "@/hooks/useTasks";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { setSearchQuery } = useTasks();

  const handleNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingTask(null), 300); // clear after animation
  };

  const handleSearchFocus = () => {
    // Basic search focus implementation
    const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
    if (searchInput) {
      searchInput.focus();
    }
  };

  useShortcuts({
    onNewTask: handleNewTask,
    onSearchFocus: handleSearchFocus,
    onEscape: handleCloseModal,
  });

  return (
    <main className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 transition-colors bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px]">
      <Header onNewTask={handleNewTask} />
      <div className="flex-1 overflow-hidden relative">
        <Board onEditTask={handleEditTask} onNewTask={handleNewTask} />
      </div>
      <Footer />
      
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingTask={editingTask}
      />
    </main>
  );
}

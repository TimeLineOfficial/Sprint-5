import React, { useState, useEffect, useCallback } from 'react';
import { TaskProvider } from './context/TaskContext';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { Board } from './components/Board';
import { TaskModal } from './components/TaskModal';
import { Toast } from './components/Toast';

export function AppContent() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskpulse_theme') || 'dark';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialColumnId, setInitialColumnId] = useState('todo');
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskpulse_theme', theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleOpenCreateModal = useCallback((colId = 'todo') => {
    setTaskToEdit(null);
    setInitialColumnId(colId);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  }, []);

  return (
    <>
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="app-main">
        {/* Real-time Metrics & React Profiler Render Counter */}
        <MetricsBar />

        {/* Kanban Board Layout (Phase 1, 2, 3) */}
        <Board
          onOpenCreateModal={handleOpenCreateModal}
          onEditTask={handleOpenEditModal}
        />
      </main>

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialColumnId={initialColumnId}
        taskToEdit={taskToEdit}
      />

      {/* Notification Toast */}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

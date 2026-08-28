import React, { useEffect, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2 } from 'lucide-react';

export function Toast() {
  const { lastMovedTaskId, tasks } = useTasks();
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (lastMovedTaskId) {
      const movedTask = tasks.find(t => t.id === lastMovedTaskId);
      if (movedTask) {
        setToastMessage(`Task "${movedTask.title}" moved to ${movedTask.columnId.replace('_', ' ').toUpperCase()}`);
        const timer = setTimeout(() => setToastMessage(null), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [lastMovedTaskId, tasks]);

  if (!toastMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      background: 'var(--bg-surface-elevated)',
      border: '1px solid var(--color-success)',
      borderRadius: 'var(--radius-lg)',
      padding: '0.75rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: 'var(--text-main)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: 3000,
      fontSize: '0.875rem',
      animation: 'fadeIn 0.2s ease forwards'
    }}>
      <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
      <span>{toastMessage}</span>
    </div>
  );
}

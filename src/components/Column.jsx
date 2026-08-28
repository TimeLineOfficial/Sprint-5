import React, { memo, useState, useCallback } from 'react';
import { TaskCard } from './TaskCard';
import { Circle, Clock, Code, CheckCircle2, Plus } from 'lucide-react';

const COLUMN_ICONS = {
  todo: Circle,
  in_progress: Clock,
  review: Code,
  done: CheckCircle2
};

export const Column = memo(function Column({
  column,
  tasks,
  onOpenCreateModal,
  onEditTask,
  draggedTaskId,
  onMoveTask
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  }, [isDragOver]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onMoveTask(taskId, column.id);
    }
  }, [draggedTaskId, column.id, onMoveTask]);

  const ColumnIcon = COLUMN_ICONS[column.id] || Circle;

  return (
    <div
      className={`kanban-column ${isDragOver ? 'kanban-column--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="column-header">
        <div className="column-title-group">
          <div className="column-dot" style={{ backgroundColor: column.color }} />
          <ColumnIcon size={18} style={{ color: column.color }} />
          <h3 className="column-title">{column.title}</h3>
        </div>

        <span className="column-badge">{tasks.length}</span>
      </div>

      {/* Task Cards List */}
      <div className="column-cards-list">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            isDragging={draggedTaskId === task.id}
            onDragStart={(e, id) => {
              e.dataTransfer.setData('text/plain', id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragEnd={() => {}}
          />
        ))}

        {tasks.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1rem',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            textAlign: 'center'
          }}>
            Drop tasks here
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <button
        type="button"
        className="btn-secondary"
        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
        onClick={() => onOpenCreateModal(column.id)}
      >
        <Plus size={16} />
        <span>Add Task</span>
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.column === nextProps.column &&
    prevProps.tasks === nextProps.tasks &&
    prevProps.draggedTaskId === nextProps.draggedTaskId
  );
});

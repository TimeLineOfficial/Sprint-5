import React, { memo, useCallback, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Calendar, Edit3, Trash2, ArrowRightLeft } from 'lucide-react';

export const TaskCard = memo(function TaskCard({ task, onEdit, isDragging, onDragStart, onDragEnd }) {
  const { deleteTask, toggleSubtask, moveTask, columns } = useTasks();
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const handleSubtaskToggle = useCallback((subtaskId, e) => {
    e.stopPropagation();
    toggleSubtask(task.id, subtaskId);
  }, [task.id, toggleSubtask]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    if (window.confirm(`Delete task "${task.title}"?`)) {
      deleteTask(task.id);
    }
  }, [task.id, task.title, deleteTask]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit(task);
  }, [task, onEdit]);

  const handleMoveToColumn = useCallback((targetColId, e) => {
    e.stopPropagation();
    moveTask(task.id, targetColId);
    setShowMoveMenu(false);
  }, [task.id, moveTask]);

  const subtasksTotal = task.subtasks ? task.subtasks.length : 0;
  const subtasksCompleted = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;

  return (
    <div
      className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
    >
      {/* Header: Tags & Priority */}
      <div className="task-card-header">
        <div className="task-tags">
          <span className={`priority-badge priority-badge--${task.priority}`}>
            {task.priority}
          </span>
          {task.tags.map((tag, idx) => (
            <span key={idx} className="tag-pill">#{tag}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {/* Mobile Tap-to-Move Button */}
          <button
            type="button"
            className="mobile-move-btn"
            style={{ color: 'var(--color-primary)', padding: '0.2rem' }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMoveMenu(!showMoveMenu);
            }}
            title="Move to Column"
            aria-label="Move task to another column"
          >
            <ArrowRightLeft size={14} />
          </button>

          <button
            type="button"
            style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
            onClick={handleEdit}
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit3 size={14} />
          </button>
          <button
            type="button"
            style={{ color: 'var(--color-danger)', padding: '0.2rem' }}
            onClick={handleDelete}
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Mobile Column Switcher Popup Menu */}
      {showMoveMenu && (
        <div className="mobile-column-picker">
          <span className="picker-title">Move Task to:</span>
          <div className="picker-buttons">
            {columns.map(col => (
              <button
                key={col.id}
                type="button"
                className={`picker-btn ${col.id === task.columnId ? 'picker-btn--active' : ''}`}
                onClick={(e) => handleMoveToColumn(col.id, e)}
              >
                <span className="picker-dot" style={{ backgroundColor: col.color }} />
                <span>{col.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Task Title & Description */}
      <h4 className="task-title">{task.title}</h4>
      {task.description && <p className="task-desc">{task.description}</p>}

      {/* Subtasks Progress List */}
      {subtasksTotal > 0 && (
        <div className="task-subtasks">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
            <span>Subtasks ({subtasksCompleted}/{subtasksTotal})</span>
            <span>{Math.round((subtasksCompleted / subtasksTotal) * 100)}%</span>
          </div>
          {task.subtasks.map(sub => (
            <div
              key={sub.id}
              className={`subtask-item ${sub.completed ? 'subtask-item--done' : ''}`}
              onClick={(e) => handleSubtaskToggle(sub.id, e)}
            >
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={() => {}} // handled by parent onClick
                style={{ cursor: 'pointer' }}
              />
              <span>{sub.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer: Assignee & Due Date */}
      <div className="task-card-footer">
        <div className="assignee-group">
          {task.assignee && (
            <>
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="assignee-avatar"
              />
              <span className="assignee-name">{task.assignee.name}</span>
            </>
          )}
        </div>

        {task.dueDate && (
          <div className="due-date">
            <Calendar size={13} />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.task === nextProps.task &&
    prevProps.isDragging === nextProps.isDragging
  );
});

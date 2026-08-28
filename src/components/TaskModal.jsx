import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Plus, Trash2 } from 'lucide-react';

export function TaskModal({ isOpen, onClose, initialColumnId = 'todo', taskToEdit = null }) {
  const { addTask, editTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [tagInput, setTagInput] = useState('React, Frontend');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setColumnId(taskToEdit.columnId || 'todo');
      setPriority(taskToEdit.priority || 'medium');
      setTagInput((taskToEdit.tags || []).join(', '));
      setDueDate(taskToEdit.dueDate || '');
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setColumnId(initialColumnId);
      setPriority('medium');
      setTagInput('React, Architecture');
      setDueDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
      setSubtasks([
        { id: `sub-${Date.now()}-1`, title: 'Define component props interface', completed: false },
        { id: `sub-${Date.now()}-2`, title: 'Write unit tests', completed: false }
      ]);
    }
  }, [taskToEdit, initialColumnId, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (subId) => {
    setSubtasks(subtasks.filter(s => s.id !== subId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArr = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      columnId,
      priority,
      tags: tagsArr.length > 0 ? tagsArr : ['General'],
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      subtasks
    };

    if (taskToEdit) {
      editTask(taskToEdit.id, taskPayload);
    } else {
      addTask(taskPayload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Task Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Architect useReducer State Engine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Detailed task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status Column</label>
              <select
                className="form-select"
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Code Review</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🔵 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="React, State, UI"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div className="form-group">
            <label className="form-label">Subtasks Checklist</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add a subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={handleAddSubtask}
              >
                <Plus size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '120px', overflowY: 'auto' }}>
              {subtasks.map(sub => (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-surface-elevated)',
                    padding: '0.35rem 0.625rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem'
                  }}
                >
                  <span>{sub.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

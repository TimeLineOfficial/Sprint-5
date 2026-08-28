import React, { memo } from 'react';
import { useTasks } from '../context/TaskContext';
import { LayoutGrid, Plus, Search, Moon, Sun, RotateCcw } from 'lucide-react';

export const Header = memo(function Header({ onOpenCreateModal, theme, onToggleTheme }) {
  const { searchQuery, setSearchQuery, priorityFilter, setPriorityFilter, resetBoard } = useTasks();

  return (
    <header className="app-header">
      <a href="#" className="app-brand" aria-label="TaskPulse Board">
        <div className="app-brand-icon">
          <LayoutGrid size={20} />
        </div>
        <span>Task<span style={{ color: 'var(--color-primary)' }}>Pulse</span></span>
      </a>

      <div className="header-controls">
        {/* Search Input Box */}
        <div className="search-bar">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="search"
            className="search-input"
            placeholder="Search tasks or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tasks"
          />
        </div>

        {/* Priority Filter Dropdown */}
        <select
          className="priority-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          aria-label="Filter tasks by priority"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟠 High</option>
          <option value="medium">🔵 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="btn-secondary"
          onClick={onToggleTheme}
          aria-label="Toggle light or dark theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span style={{ fontSize: '0.8125rem' }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Reset Board */}
        <button
          type="button"
          className="btn-secondary"
          onClick={resetBoard}
          title="Reset board tasks to initial state"
          aria-label="Reset board tasks"
        >
          <RotateCcw size={16} />
        </button>

        {/* New Task CTA */}
        <button
          type="button"
          className="btn-primary"
          onClick={() => onOpenCreateModal('todo')}
        >
          <Plus size={18} />
          <span>Create Task</span>
        </button>
      </div>
    </header>
  );
});

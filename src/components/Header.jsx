import React, { memo, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { LayoutGrid, Plus, Search, Moon, Sun, RotateCcw, SlidersHorizontal, X } from 'lucide-react';

export const Header = memo(function Header({ onOpenCreateModal, theme, onToggleTheme }) {
  const { searchQuery, setSearchQuery, priorityFilter, setPriorityFilter, resetBoard } = useTasks();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Logo & Name */}
        <a href="#" className="app-brand" aria-label="TaskPulse Board">
          <div className="app-brand-icon">
            <LayoutGrid size={20} />
          </div>
          <span>Task<span style={{ color: 'var(--color-primary)' }}>Pulse</span></span>
        </a>

        {/* Single Unified Header Controls */}
        <div className="header-controls">
          {/* Search Input Box (Desktop/Tablet) */}
          <div className="search-bar desktop-search">
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

          {/* Priority Filter Dropdown (Desktop/Tablet) */}
          <select
            className="priority-select desktop-priority"
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

          {/* Single Theme Toggle Button */}
          <button
            type="button"
            className="btn-secondary theme-btn"
            onClick={onToggleTheme}
            aria-label="Toggle light or dark theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="theme-btn-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Reset Board Button (Desktop/Tablet) */}
          <button
            type="button"
            className="btn-secondary desktop-reset"
            onClick={resetBoard}
            title="Reset board tasks to initial state"
            aria-label="Reset board tasks"
          >
            <RotateCcw size={16} />
          </button>

          {/* Mobile Filter & Search Drawer Toggle (Phone <768px only) */}
          <button
            type="button"
            className="btn-secondary mobile-filter-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle filter menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
          </button>

          {/* Single Create Task CTA */}
          <button
            type="button"
            className="btn-primary create-task-btn"
            onClick={() => onOpenCreateModal('todo')}
          >
            <Plus size={18} />
            <span className="create-task-label">Create Task</span>
          </button>
        </div>
      </div>

      {/* Mobile Search & Filter Drawer (<768px) */}
      {isMobileMenuOpen && (
        <div className="mobile-filter-drawer">
          <div className="mobile-search-bar">
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

          <div className="mobile-drawer-row">
            <select
              className="priority-select"
              style={{ flex: 1 }}
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

            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                resetBoard();
                setIsMobileMenuOpen(false);
              }}
              title="Reset board tasks"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
});

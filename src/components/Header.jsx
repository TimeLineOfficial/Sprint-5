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

        {/* Desktop Controls Group */}
        <div className="header-controls desktop-only">
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

          {/* Theme Toggle Button (Always Visible) */}
          <button
            type="button"
            className="btn-secondary"
            onClick={onToggleTheme}
            aria-label="Toggle light or dark theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
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

        {/* Mobile Action Bar (<768px Viewports) */}
        <div className="mobile-header-actions mobile-only">
          {/* Always-Visible Theme Toggle Button on Phone Screen Header */}
          <button
            type="button"
            className="btn-secondary theme-btn-mobile"
            onClick={onToggleTheme}
            aria-label="Toggle light or dark theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Compact Create Task Button for Mobile */}
          <button
            type="button"
            className="btn-primary btn-primary-compact"
            onClick={() => onOpenCreateModal('todo')}
            aria-label="Create Task"
          >
            <Plus size={18} />
            <span className="btn-text-hide-xs">Create</span>
          </button>

          {/* Mobile Filter & Search Drawer Toggle */}
          <button
            type="button"
            className="btn-secondary filter-toggle-mobile"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle filter menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search & Filter Drawer */}
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

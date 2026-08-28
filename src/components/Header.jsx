import React, { memo, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { LayoutGrid, Plus, Search, Moon, Sun, RotateCcw, SlidersHorizontal, X } from 'lucide-react';

export const Header = memo(function Header({ onOpenCreateModal, theme, onToggleTheme }) {
  const { searchQuery, setSearchQuery, priorityFilter, setPriorityFilter, resetBoard } = useTasks();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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

        {/* Header Controls Container */}
        <div className="header-controls">
          {/* Universal Search Bar & Search Icon (Visible on all devices) */}
          <div className={`search-bar ${isSearchExpanded ? 'search-bar--expanded' : ''}`}>
            <button
              type="button"
              className="search-icon-btn"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              aria-label="Toggle search input"
              title="Search tasks"
            >
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
            </button>

            <input
              type="search"
              className="search-input"
              placeholder="Search tasks or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tasks"
            />

            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Priority Select (Desktop/Tablet) */}
          <select
            className="priority-select desktop-only-control"
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

          {/* Theme Toggle Button (All Devices) */}
          <button
            type="button"
            className="btn-secondary theme-btn"
            onClick={onToggleTheme}
            aria-label="Toggle light or dark theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="theme-btn-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Reset Board Button (Desktop/Tablet) */}
          <button
            type="button"
            className="btn-secondary desktop-only-control"
            onClick={resetBoard}
            title="Reset board tasks to initial state"
            aria-label="Reset board tasks"
          >
            <RotateCcw size={16} />
          </button>

          {/* Mobile Filter Drawer Toggle (<768px) */}
          <button
            type="button"
            className="btn-secondary mobile-filter-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle filter menu"
            title="Filters"
          >
            {isMobileMenuOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
          </button>

          {/* Create Task CTA (All Devices) */}
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

      {/* Mobile Filter Drawer (<768px) */}
      {isMobileMenuOpen && (
        <div className="mobile-filter-drawer">
          <div className="mobile-drawer-row">
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>Priority Filter:</label>
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

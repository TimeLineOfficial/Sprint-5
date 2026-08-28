/**
 * LocalStorage Storage Utility & Seed Data Initializer
 */

export const INITIAL_COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#3B82F6', icon: 'Circle' },
  { id: 'in_progress', title: 'In Progress', color: '#F59E0B', icon: 'Clock' },
  { id: 'review', title: 'Code Review', color: '#8B5CF6', icon: 'Code' },
  { id: 'done', title: 'Completed', color: '#10B981', icon: 'CheckCircle2' }
];

export const INITIAL_TASKS = [
  {
    id: 'task-101',
    columnId: 'todo',
    title: 'Migrate Core App Architecture to React 18',
    description: 'Decompose monolithic DOM scripts into isolated, declarative components with Strict Mode compliance.',
    priority: 'high',
    tags: ['React', 'Architecture'],
    assignee: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    dueDate: '2026-09-02',
    subtasks: [
      { id: 'sub-1', title: 'Setup Vite + React SPA', completed: true },
      { id: 'sub-2', title: 'Configure TaskContext & Reducer', completed: true },
      { id: 'sub-3', title: 'Lift State to Common Ancestor', completed: false }
    ],
    createdAt: '2026-08-28T10:00:00.000Z'
  },
  {
    id: 'task-102',
    columnId: 'todo',
    title: 'Implement Native HTML5 Drag and Drop Handlers',
    description: 'Add dragStart, dragOver, and drop event handlers with visual ghost previews and column drop zones.',
    priority: 'high',
    tags: ['UX', 'Interactions'],
    assignee: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    dueDate: '2026-09-04',
    subtasks: [
      { id: 'sub-4', title: 'Bind onDragOver event preventDefault', completed: true },
      { id: 'sub-5', title: 'Sync state with moveTask action', completed: false }
    ],
    createdAt: '2026-08-28T11:30:00.000Z'
  },
  {
    id: 'task-103',
    columnId: 'in_progress',
    title: 'Architect Immutable useReducer State Engine',
    description: 'Replace generic useState hooks with a multi-variable taskReducer handling MOVE, ADD, EDIT, and DELETE actions.',
    priority: 'urgent',
    tags: ['State Engine', 'Redux Pattern'],
    assignee: { name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    dueDate: '2026-08-30',
    subtasks: [
      { id: 'sub-6', title: 'Build taskReducer action dispatcher', completed: true },
      { id: 'sub-7', title: 'Persist state to LocalStorage synchronously', completed: true }
    ],
    createdAt: '2026-08-28T09:15:00.000Z'
  },
  {
    id: 'task-104',
    columnId: 'in_progress',
    title: 'Enforce Precision React.memo & useCallback Hooks',
    description: 'Wrap TaskCard and Column in React.memo to mathematically prevent un-moved cards from re-rendering.',
    priority: 'medium',
    tags: ['Performance', 'Memoization'],
    assignee: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
    dueDate: '2026-09-01',
    subtasks: [
      { id: 'sub-8', title: 'Profile drag render count', completed: true },
      { id: 'sub-9', title: 'Add live React Profiler Render Badge', completed: true }
    ],
    createdAt: '2026-08-28T14:20:00.000Z'
  },
  {
    id: 'task-105',
    columnId: 'review',
    title: 'Audit Lighthouse 100/100 Core Web Vitals',
    description: 'Verify sub-50ms TTFB, zero Cumulative Layout Shift, and full accessibility ARIA compliance.',
    priority: 'medium',
    tags: ['QA', 'Lighthouse'],
    assignee: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    dueDate: '2026-08-29',
    subtasks: [
      { id: 'sub-10', title: 'Audit color contrast ratios', completed: true },
      { id: 'sub-11', title: 'Verify zero CLS layout shifts', completed: true }
    ],
    createdAt: '2026-08-27T16:00:00.000Z'
  },
  {
    id: 'task-106',
    columnId: 'done',
    title: 'Configure GitHub Actions CI/CD Deployment Pipeline',
    description: 'Automate Vite React production build compilation and deployment to GitHub Pages on every push to main.',
    priority: 'low',
    tags: ['DevOps', 'GitHub'],
    assignee: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    dueDate: '2026-08-28',
    subtasks: [
      { id: 'sub-12', title: 'Configure deploy.yml workflow', completed: true },
      { id: 'sub-13', title: 'Verify production edge URL', completed: true }
    ],
    createdAt: '2026-08-26T08:00:00.000Z'
  }
];

const STORAGE_KEY = 'taskpulse_kanban_state_v1';

export function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.tasks)) {
        return {
          tasks: parsed.tasks,
          columns: parsed.columns || INITIAL_COLUMNS
        };
      }
    }
  } catch (err) {
    console.warn('[LocalStorage] Error parsing stored state:', err);
  }

  return {
    tasks: INITIAL_TASKS,
    columns: INITIAL_COLUMNS
  };
}

export function saveStateToStorage(tasks, columns) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, columns }));
  } catch (err) {
    console.warn('[LocalStorage] Failed to save state:', err);
  }
}

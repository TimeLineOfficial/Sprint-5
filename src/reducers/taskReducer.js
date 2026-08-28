/**
 * Pure Immutable Reducer State Machine for Kanban Task Operations
 * Phase 3 Architecture Directive
 */

export const ACTION_TYPES = {
  MOVE_TASK: 'MOVE_TASK',
  ADD_TASK: 'ADD_TASK',
  EDIT_TASK: 'EDIT_TASK',
  DELETE_TASK: 'DELETE_TASK',
  TOGGLE_SUBTASK: 'TOGGLE_SUBTASK',
  SET_SEARCH: 'SET_SEARCH',
  SET_PRIORITY_FILTER: 'SET_PRIORITY_FILTER',
  RESET_BOARD: 'RESET_BOARD'
};

export function taskReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.MOVE_TASK: {
      const { taskId, targetColumnId, targetIndex } = action.payload;
      const taskIndex = state.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return state;

      const targetTask = state.tasks[taskIndex];
      // If column and position are unchanged, return identical state instance
      if (targetTask.columnId === targetColumnId && targetIndex === undefined) {
        return state;
      }

      const updatedTask = {
        ...targetTask,
        columnId: targetColumnId,
        updatedAt: new Date().toISOString()
      };

      const remainingTasks = state.tasks.filter(t => t.id !== taskId);
      
      let nextTasks = [];
      if (targetIndex !== undefined && targetIndex >= 0) {
        // Insert task at target index within target column
        const columnTasks = remainingTasks.filter(t => t.columnId === targetColumnId);
        const otherColumnTasks = remainingTasks.filter(t => t.columnId !== targetColumnId);
        
        columnTasks.splice(targetIndex, 0, updatedTask);
        nextTasks = [...otherColumnTasks, ...columnTasks];
      } else {
        nextTasks = [...remainingTasks, updatedTask];
      }

      return {
        ...state,
        tasks: nextTasks,
        lastMovedTaskId: taskId,
        renderCount: state.renderCount + 1
      };
    }

    case ACTION_TYPES.ADD_TASK: {
      const newTask = {
        id: `task-${Date.now()}`,
        columnId: action.payload.columnId || 'todo',
        title: action.payload.title,
        description: action.payload.description || '',
        priority: action.payload.priority || 'medium',
        tags: action.payload.tags || ['General'],
        assignee: action.payload.assignee || {
          name: 'Team Member',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
        },
        dueDate: action.payload.dueDate || new Date().toISOString().split('T')[0],
        subtasks: action.payload.subtasks || [],
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        tasks: [newTask, ...state.tasks],
        renderCount: state.renderCount + 1
      };
    }

    case ACTION_TYPES.EDIT_TASK: {
      const { taskId, updates } = action.payload;
      const nextTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      });

      return {
        ...state,
        tasks: nextTasks,
        renderCount: state.renderCount + 1
      };
    }

    case ACTION_TYPES.DELETE_TASK: {
      const nextTasks = state.tasks.filter(task => task.id !== action.payload.taskId);
      return {
        ...state,
        tasks: nextTasks,
        renderCount: state.renderCount + 1
      };
    }

    case ACTION_TYPES.TOGGLE_SUBTASK: {
      const { taskId, subtaskId } = action.payload;
      const nextTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          const nextSubtasks = task.subtasks.map(sub => {
            if (sub.id === subtaskId) {
              return { ...sub, completed: !sub.completed };
            }
            return sub;
          });
          return { ...task, subtasks: nextSubtasks };
        }
        return task;
      });

      return {
        ...state,
        tasks: nextTasks,
        renderCount: state.renderCount + 1
      };
    }

    case ACTION_TYPES.SET_SEARCH: {
      return {
        ...state,
        searchQuery: action.payload
      };
    }

    case ACTION_TYPES.SET_PRIORITY_FILTER: {
      return {
        ...state,
        priorityFilter: action.payload
      };
    }

    case ACTION_TYPES.RESET_BOARD: {
      return {
        ...state,
        tasks: action.payload.tasks,
        columns: action.payload.columns,
        searchQuery: '',
        priorityFilter: 'all',
        renderCount: state.renderCount + 1
      };
    }

    default:
      return state;
  }
}

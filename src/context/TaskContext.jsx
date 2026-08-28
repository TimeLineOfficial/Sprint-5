import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { taskReducer, ACTION_TYPES } from '../reducers/taskReducer';
import { loadStoredState, saveStateToStorage, INITIAL_TASKS, INITIAL_COLUMNS } from '../utils/storage';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const initialState = useMemo(() => {
    const stored = loadStoredState();
    return {
      tasks: stored.tasks,
      columns: stored.columns,
      searchQuery: '',
      priorityFilter: 'all',
      lastMovedTaskId: null,
      renderCount: 0
    };
  }, []);

  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Synchronously persist tasks to LocalStorage on state change
  useEffect(() => {
    saveStateToStorage(state.tasks, state.columns);
  }, [state.tasks, state.columns]);

  // Phase 3 Memoized Dispatch Actions using useCallback
  const moveTask = useCallback((taskId, targetColumnId, targetIndex) => {
    dispatch({
      type: ACTION_TYPES.MOVE_TASK,
      payload: { taskId, targetColumnId, targetIndex }
    });
  }, []);

  const addTask = useCallback((taskData) => {
    dispatch({
      type: ACTION_TYPES.ADD_TASK,
      payload: taskData
    });
  }, []);

  const editTask = useCallback((taskId, updates) => {
    dispatch({
      type: ACTION_TYPES.EDIT_TASK,
      payload: { taskId, updates }
    });
  }, []);

  const deleteTask = useCallback((taskId) => {
    dispatch({
      type: ACTION_TYPES.DELETE_TASK,
      payload: { taskId }
    });
  }, []);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    dispatch({
      type: ACTION_TYPES.TOGGLE_SUBTASK,
      payload: { taskId, subtaskId }
    });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({
      type: ACTION_TYPES.SET_SEARCH,
      payload: query
    });
  }, []);

  const setPriorityFilter = useCallback((priority) => {
    dispatch({
      type: ACTION_TYPES.SET_PRIORITY_FILTER,
      payload: priority
    });
  }, []);

  const resetBoard = useCallback(() => {
    dispatch({
      type: ACTION_TYPES.RESET_BOARD,
      payload: { tasks: INITIAL_TASKS, columns: INITIAL_COLUMNS }
    });
  }, []);

  // Filter tasks with useMemo to prevent unnecessary calculations
  const filteredTasks = useMemo(() => {
    const search = state.searchQuery.toLowerCase().trim();
    const priority = state.priorityFilter;

    return state.tasks.filter(task => {
      const matchesSearch = !search ||
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.tags.some(t => t.toLowerCase().includes(search));

      const matchesPriority = priority === 'all' || task.priority === priority;

      return matchesSearch && matchesPriority;
    });
  }, [state.tasks, state.searchQuery, state.priorityFilter]);

  // Compute live board metrics using useMemo
  const metrics = useMemo(() => {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.columnId === 'done').length;
    const inProgress = state.tasks.filter(t => t.columnId === 'in_progress').length;
    const urgentHigh = state.tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      urgentHigh,
      completionRate
    };
  }, [state.tasks]);

  const value = useMemo(() => ({
    tasks: state.tasks,
    columns: state.columns,
    filteredTasks,
    metrics,
    searchQuery: state.searchQuery,
    priorityFilter: state.priorityFilter,
    renderCount: state.renderCount,
    lastMovedTaskId: state.lastMovedTaskId,
    moveTask,
    addTask,
    editTask,
    deleteTask,
    toggleSubtask,
    setSearchQuery,
    setPriorityFilter,
    resetBoard
  }), [
    state.tasks,
    state.columns,
    filteredTasks,
    metrics,
    state.searchQuery,
    state.priorityFilter,
    state.renderCount,
    state.lastMovedTaskId,
    moveTask,
    addTask,
    editTask,
    deleteTask,
    toggleSubtask,
    setSearchQuery,
    setPriorityFilter,
    resetBoard
  ]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

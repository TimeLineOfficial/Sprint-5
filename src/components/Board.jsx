import React, { useState, useCallback, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { Column } from './Column';

export function Board({ onOpenCreateModal, onEditTask }) {
  const { columns, filteredTasks, moveTask } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const handleMoveTask = useCallback((taskId, targetColumnId) => {
    moveTask(taskId, targetColumnId);
    setDraggedTaskId(null);
  }, [moveTask]);

  // Group filtered tasks by columnId efficiently using useMemo
  const tasksByColumn = useMemo(() => {
    const map = {};
    columns.forEach(col => {
      map[col.id] = [];
    });

    filteredTasks.forEach(task => {
      if (map[task.columnId]) {
        map[task.columnId].push(task);
      } else {
        if (!map['todo']) map['todo'] = [];
        map['todo'].push(task);
      }
    });

    return map;
  }, [columns, filteredTasks]);

  return (
    <div className="kanban-board">
      {columns.map(col => (
        <Column
          key={col.id}
          column={col}
          tasks={tasksByColumn[col.id] || []}
          onOpenCreateModal={onOpenCreateModal}
          onEditTask={onEditTask}
          draggedTaskId={draggedTaskId}
          onMoveTask={handleMoveTask}
        />
      ))}
    </div>
  );
}

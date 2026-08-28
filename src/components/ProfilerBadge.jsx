import React, { memo } from 'react';
import { useTasks } from '../context/TaskContext';
import { Zap } from 'lucide-react';

export const ProfilerBadge = memo(function ProfilerBadge() {
  const { renderCount } = useTasks();

  return (
    <div className="profiler-badge">
      <Zap size={14} style={{ color: '#10B981' }} />
      <span>React.memo & useReducer Active</span>
      <span style={{
        background: '#10B981',
        color: '#ffffff',
        padding: '0.1rem 0.45rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.7rem'
      }}>
        State Dispatches: {renderCount}
      </span>
    </div>
  );
});

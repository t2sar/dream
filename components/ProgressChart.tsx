import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { HabitLog, Habit } from '../types';
import { format } from 'date-fns';

interface ProgressChartProps {
  logs: HabitLog;
  habits: Habit[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ logs, habits }) => {
  // Generate data for the last 14 days
  const data = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = logs[dateStr]?.length || 0;
    
    return {
      date: format(date, 'MMM dd'),
      completed: completedCount,
      day: format(date, 'EEE'), // Mon, Tue...
    };
  });

  // Calculate overall completion rate
  const totalPossible = habits.length * 14;
  const totalCompleted = data.reduce((acc, curr) => acc + curr.completed, 0);
  const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-3xl border-t border-sky-500/10">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Completion Rate</p>
          <div className="flex items-end gap-3">
            <h3 className="text-5xl font-bold text-sky-400 tracking-tighter">{completionRate}%</h3>
            <span className="text-slate-500 text-sm mb-1.5">last 14 days</span>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl">
           <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Total Completed</p>
           <h3 className="text-5xl font-bold text-emerald-400 tracking-tighter">{totalCompleted}</h3>
        </div>
         <div className="glass p-6 rounded-3xl">
           <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Active Habits</p>
           <h3 className="text-5xl font-bold text-slate-200 tracking-tighter">{habits.length}</h3>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl h-[400px]">
        <h3 className="text-lg font-semibold text-white mb-6">Daily Activity</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: '#38bdf8' }}
              cursor={{ fill: '#38bdf8', opacity: 0.1 }}
            />
            <Bar dataKey="completed" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.completed >= habits.length && habits.length > 0 ? '#10b981' : '#38bdf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
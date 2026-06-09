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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-none border border-white/5 relative">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00F5D4]/40" />
          <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold mb-2">COMPLETION CONCORDANCE</p>
          <div className="flex items-end gap-3">
            <h3 className="text-5xl font-bold text-[#00F5D4] font-display tracking-tight">{completionRate}%</h3>
            <span className="text-slate-600 font-mono text-[9px] mb-2 uppercase tracking-wider">last 14 days</span>
          </div>
        </div>
        
        <div className="glass p-6 rounded-none border border-white/5 relative">
           <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00F5D4]/40" />
           <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold mb-2">TOTAL COMPLETED</p>
           <h3 className="text-5xl font-bold text-violet-400 font-display tracking-tight">{totalCompleted}</h3>
        </div>
        
        <div className="glass p-6 rounded-none border border-white/5 relative">
           <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00F5D4]/40" />
           <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold mb-2">ACTIVE SECTORS</p>
           <h3 className="text-5xl font-bold text-slate-200 font-display tracking-tight">{habits.length}</h3>
        </div>
      </div>

      <div className="glass p-8 rounded-none border border-white/5 h-[400px] relative">
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#00F5D4]/40" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-[#00F5D4] mb-6">DAILY ACTIVITY LOGS</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f232b" opacity={0.4} vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500, fontFamily: '"Google Sans", sans-serif' }} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: '"Google Sans", sans-serif' }} 
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#07080a', borderColor: 'rgba(0, 245, 212, 0.3)', borderRadius: '0px', color: '#f8fafc', fontFamily: '"Google Sans", sans-serif', fontSize: '10px' }}
              itemStyle={{ color: '#00F5D4' }}
              cursor={{ fill: 'rgba(0, 245, 212, 0.05)' }}
            />
            <Bar dataKey="completed" radius={[0, 0, 0, 0]} maxBarSize={30}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.completed >= habits.length && habits.length > 0 ? '#00F5D4' : '#7B2CBF'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { HabitLog, Habit } from "../types";
import { format } from "date-fns";

interface ProgressChartProps {
  logs: HabitLog;
  habits: Habit[];
}

export const ProgressChart: React.FC<ProgressChartProps> = React.memo(({
  logs,
  habits,
}) => {
  // Generate data for the last 14 days
  const data = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dateStr = format(date, "yyyy-MM-dd");
    const completedCount = logs[dateStr]?.length || 0;

    return {
      date: format(date, "MMM dd"),
      completed: completedCount,
      day: format(date, "EEE"), // Mon, Tue...
    };
  });

  // Calculate 30-day Completion Rate dataset
  const data30Days = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = format(date, "yyyy-MM-dd");
    const completedCount = logs[dateStr]?.length || 0;
    const activeHabitsOnDay = habits.filter(h => !h.createdAt || format(new Date(h.createdAt), "yyyy-MM-dd") <= dateStr).length || habits.length;
    const rate = activeHabitsOnDay > 0 ? Math.round((completedCount / activeHabitsOnDay) * 100) : 0;

    return {
      date: format(date, "MMM dd"),
      rate: Math.min(100, rate),
      completed: completedCount,
    };
  });

  // Calculate overall completion rate
  const totalPossible = habits.length * 14;
  const totalCompleted = data.reduce((acc, curr) => acc + curr.completed, 0);
  const completionRate =
    totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-none border border-white/5 relative">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00F5D4]/40" />
          <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold mb-2">
            COMPLETION CONCORDANCE
          </p>
          <div className="flex items-end gap-3">
            <h3 className="text-5xl font-bold text-[#00F5D4] font-display tracking-tight">
              {completionRate}%
            </h3>
            <span className="text-slate-600 font-mono text-[9px] mb-2 uppercase tracking-wider">
              last 14 days
            </span>
          </div>
        </div>

        <div className="glass p-6 rounded-none border border-white/5 relative">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00F5D4]/40" />
          <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold mb-2">
            TOTAL COMPLETED
          </p>
          <h3 className="text-5xl font-bold text-violet-400 font-display tracking-tight">
            {totalCompleted}
          </h3>
        </div>

        <div className="glass p-6 rounded-none border border-white/5 relative">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00F5D4]/40" />
          <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold mb-2">
            ACTIVE SECTORS
          </p>
          <h3 className="text-5xl font-bold text-slate-200 font-display tracking-tight">
            {habits.length}
          </h3>
        </div>
      </div>

      <div className="bg-surface-soft p-6 md:p-8 rounded-[32px] border border-surface-alt shadow-sm h-[400px] relative">
        <h3 className="text-sm font-bold tracking-wide uppercase text-secondary-text mb-6">
          Daily Activity Logs
        </h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f232b"
              opacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{
                fill: "#64748b",
                fontSize: 10,
                fontWeight: 500,
                fontFamily: '"Google Sans", sans-serif',
              }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              tick={{
                fill: "#64748b",
                fontSize: 10,
                fontFamily: '"Google Sans", sans-serif',
              }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f232b",
                borderColor: "#333d4f",
                borderRadius: "16px",
                color: "#f8fafc",
                fontFamily: '"Google Sans", sans-serif',
                fontSize: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#4ade80" }}
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            />
            <Bar dataKey="completed" radius={[4, 4, 0, 0]} maxBarSize={30}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.completed >= habits.length && habits.length > 0
                      ? "#4ade80"
                      : "#22d3ee"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-surface-soft p-6 md:p-8 rounded-[32px] border border-surface-alt shadow-sm h-[400px] relative">
        <h3 className="text-sm font-bold tracking-wide uppercase text-secondary-text mb-6">
          30-Day Completion Consistency (%)
        </h3>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart
            data={data30Days}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f232b"
              opacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{
                fill: "#64748b",
                fontSize: 10,
                fontWeight: 500,
                fontFamily: '"Google Sans", sans-serif',
              }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              tick={{
                fill: "#64748b",
                fontSize: 10,
                fontFamily: '"Google Sans", sans-serif',
              }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f232b",
                borderColor: "#333d4f",
                borderRadius: "16px",
                color: "#f8fafc",
                fontFamily: '"Google Sans", sans-serif',
                fontSize: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#00F5D4" }}
              cursor={{ stroke: "rgba(255, 255, 255, 0.05)" }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              name="Completion Rate"
              stroke="#00F5D4"
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 1, fill: "#0c0f12" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

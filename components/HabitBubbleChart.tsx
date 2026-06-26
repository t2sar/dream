import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Habit, HabitLog } from '../types';

interface HabitBubbleChartProps {
  habits: Habit[];
  logs: HabitLog;
}

export const HabitBubbleChart: React.FC<HabitBubbleChartProps> = ({ habits, logs }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || habits.length === 0) return;

    // Process data
    const data = habits.map(habit => {
      let difficultyValue = 2; // Default medium
      if (habit.difficulty === 'easy') difficultyValue = 1;
      if (habit.difficulty === 'hard') difficultyValue = 3;

      // Calculate real average streak
      let currentStreak = 0;
      let allStreaks: number[] = [];
      
      const sortedDates = Object.keys(logs).sort();
      for (const date of sortedDates) {
        if (logs[date].includes(habit.id)) {
          currentStreak++;
        } else {
          if (currentStreak > 0) {
            allStreaks.push(currentStreak);
            currentStreak = 0;
          }
        }
      }
      if (currentStreak > 0) {
        allStreaks.push(currentStreak);
      }
      
      const averageStreak = allStreaks.length > 0 
        ? allStreaks.reduce((a, b) => a + b, 0) / allStreaks.length 
        : habit.streak || 0; // Fallback to current streak

      return {
        id: habit.id,
        name: habit.name,
        difficulty: difficultyValue,
        difficultyLabel: habit.difficulty || 'medium',
        averageStreak,
        totalCompletions: habit.totalCompletions || 1,
        color: habit.color || '#A8C3A6'
      };
    });

    // We add some jitter to difficulty to prevent bubbles from stacking exactly on top of each other
    data.forEach(d => {
      // Add slight random offset between -0.15 and 0.15
      const jitter = (Math.random() - 0.5) * 0.3;
      d.difficulty += jitter;
    });

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .style("width", "100%")
       .style("height", "100%");

    // Add X axis
    const x = d3.scaleLinear()
      .domain([0.5, 3.5])
      .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(x)
      .tickValues([1, 2, 3])
      .tickFormat((d) => {
        if (d === 1) return "Easy";
        if (d === 2) return "Medium";
        if (d === 3) return "Hard";
        return "";
      });

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .attr("color", "#64748b")
      .selectAll("text")
      .style("font-family", '"Google Sans", sans-serif')
      .style("font-size", "12px");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, Math.max(d3.max(data, d => d.averageStreak) || 10, 5)])
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#64748b")
      .selectAll("text")
      .style("font-family", '"Google Sans", sans-serif')
      .style("font-size", "12px");

    // Add X axis label
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .style("fill", "#64748b")
      .style("font-size", "12px")
      .style("font-family", '"Google Sans", sans-serif')
      .text("Habit Difficulty");

    // Add Y axis label
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", 12)
      .attr("x", -height / 2)
      .style("fill", "#64748b")
      .style("font-size", "12px")
      .style("font-family", '"Google Sans", sans-serif')
      .text("Avg Streak");

    // Add a scale for bubble size
    const z = d3.scaleSqrt()
      .domain([1, Math.max(d3.max(data, d => d.totalCompletions) || 10, 2)])
      .range([5, 25]);

    // Add tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("background-color", "#1f232b")
      .style("color", "#f8fafc")
      .style("padding", "8px 12px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("font-family", '"Google Sans", sans-serif')
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 100)
      .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.1)");

    // Add dots
    svg.append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
        .attr("cx", d => x(d.difficulty))
        .attr("cy", d => y(d.averageStreak))
        .attr("r", d => z(d.totalCompletions))
        .style("fill", d => d.color)
        .style("opacity", 0.7)
        .attr("stroke", "#1f232b")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
          d3.select(this).style("opacity", 1).attr("stroke", "#f8fafc");
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`
            <div style="font-weight:bold;margin-bottom:4px">${d.name}</div>
            <div>Difficulty: <span style="text-transform:capitalize">${d.difficultyLabel}</span></div>
            <div>Avg Streak: ${d.averageStreak.toFixed(1)}</div>
            <div>Completions: ${d.totalCompletions}</div>
          `)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", function(event) {
          tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseleave", function(event, d) {
          d3.select(this).style("opacity", 0.7).attr("stroke", "#1f232b");
          tooltip.transition().duration(500).style("opacity", 0);
        });

    return () => {
      tooltip.remove();
    };
  }, [habits, logs]);

  return (
    <div className="bg-surface-soft p-6 md:p-8 rounded-[32px] border border-surface-alt shadow-sm h-[400px] relative mt-6">
      <h3 className="text-sm font-bold tracking-wide uppercase text-secondary-text mb-6">
        Habit Difficulty vs. Average Streak
      </h3>
      <div className="w-full h-[calc(100%-2rem)] flex items-center justify-center">
        {habits.length === 0 ? (
          <p className="text-secondary-text text-sm">No habits available to visualize.</p>
        ) : (
          <svg ref={svgRef}></svg>
        )}
      </div>
    </div>
  );
};

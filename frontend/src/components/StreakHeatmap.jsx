import React, { useMemo } from "react";
import "./StreakHeatmap.css";

const StreakHeatmap = ({ solvedDates = [] }) => {
  const { grid, totalWeeks, dayLabels } = useMemo(() => {
    const today = new Date();
    const weeksToShow = 20;
    const totalDays = weeksToShow * 7;

    // Build a set of solved dates for O(1) lookup
    const solvedSet = new Set(solvedDates);

    // Start from `totalDays` ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const grid = [];
    const currentDate = new Date(startDate);

    for (let week = 0; week < weeksToShow; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const isToday = dateStr === today.toISOString().split("T")[0];
        const isFuture = currentDate > today;
        const isSolved = solvedSet.has(dateStr);

        weekDays.push({
          date: dateStr,
          isToday,
          isFuture,
          isSolved,
          dayOfWeek: day,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      grid.push(weekDays);
    }

    return {
      grid,
      totalWeeks: weeksToShow,
      dayLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    };
  }, [solvedDates]);

  const monthLabels = useMemo(() => {
    const labels = [];
    const today = new Date();
    const totalDays = 20 * 7;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let lastMonth = -1;
    grid.forEach((week, weekIndex) => {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        labels.push({
          weekIndex,
          label: firstDay.toLocaleString("default", { month: "short" }),
        });
        lastMonth = month;
      }
    });
    return labels;
  }, [grid]);

  return (
    <div className="streak-heatmap">
      <div className="heatmap-wrapper">
        <div className="day-labels">
          {dayLabels.map((label, i) => (
            <span key={i} className="day-label">
              {i % 2 === 1 ? label : ""}
            </span>
          ))}
        </div>
        <div className="heatmap-grid">
          <div className="month-labels">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="month-label"
                style={{ gridColumn: m.weekIndex + 1 }}
              >
                {m.label}
              </span>
            ))}
          </div>
          <div className="cells-grid">
            {grid.map((week, wi) => (
              <div key={wi} className="heatmap-week">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`heatmap-cell ${
                      day.isFuture
                        ? "future"
                        : day.isSolved
                        ? "solved"
                        : "empty"
                    } ${day.isToday ? "today" : ""}`}
                    title={`${day.date}${day.isSolved ? " ✓ Solved" : ""}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        <div className="heatmap-cell empty" />
        <div className="heatmap-cell solved" />
        <span className="legend-label">More</span>
      </div>
    </div>
  );
};

export default StreakHeatmap;

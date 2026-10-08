import React, { useState } from 'react';
import { ActivityDay } from '../types';

interface HeatmapGridProps {
  activityHistory: Record<string, ActivityDay>;
  compact?: boolean;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  activityHistory,
  compact = false,
}) => {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
    visible: boolean;
  }>({ text: '', x: 0, y: 0, visible: false });

  // Generate 52 weeks (364 days) grouped by week
  const today = new Date();
  const weeks: { dateStr: string; day: ActivityDay }[][] = [];
  const totalDays = compact ? 120 : 364;

  let currentWeek: { dateStr: string; day: ActivityDay }[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayData = activityHistory[dateStr] || {
      date: dateStr,
      count: 0,
      xp: 0,
      minutes: 0,
      challengesSolved: [],
      conceptsPracticed: [],
    };

    currentWeek.push({ dateStr, day: dayData });
    if (currentWeek.length === 7 || i === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-[#0f172a]/60 hover:border-white/20 border border-white/5';
    if (count === 1) return 'bg-phantom-purple/40 border border-phantom-purple/60 shadow-sm';
    if (count === 2) return 'bg-phantom-purple/80 border border-phantom-violet shadow-sm';
    if (count <= 4) return 'bg-phantom-cyan/70 border border-phantom-cyan shadow-glow-cyan';
    return 'bg-phantom-cyan border border-white shadow-glow-cyan';
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    day: ActivityDay
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const formatted = new Date(day.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const info =
      day.count > 0
        ? `${day.count} bugs fixed (${day.xp} XP) on ${formatted}`
        : `No activity on ${formatted}`;

    setTooltip({
      text: info,
      x: rect.left + rect.width / 2,
      y: rect.top - 36,
      visible: true,
    });
  };

  return (
    <div className="relative w-full">
      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 px-2.5 py-1 text-[11px] font-mono text-white bg-black/90 border border-phantom-purple/60 rounded-md shadow-xl whitespace-nowrap"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex gap-1.5 min-w-full">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((cell) => (
                <div
                  key={cell.dateStr}
                  onMouseEnter={(e) => handleMouseEnter(e, cell.day)}
                  onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                  className={`w-3.5 h-3.5 rounded-[3px] transition-all cursor-pointer ${getCellColor(
                    cell.day.count
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-white/40 mt-3 pt-2 border-t border-white/5 select-none font-mono">
        <div className="flex items-center gap-1.5">
          <span>Less activity</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-[#0f172a]/80 border border-white/5" />
          <div className="w-2.5 h-2.5 rounded-sm bg-phantom-purple/40" />
          <div className="w-2.5 h-2.5 rounded-sm bg-phantom-purple/80" />
          <div className="w-2.5 h-2.5 rounded-sm bg-phantom-cyan/70" />
          <div className="w-2.5 h-2.5 rounded-sm bg-phantom-cyan" />
          <span>More activity</span>
        </div>

        <div>
          <span>365-Day History</span>
        </div>
      </div>
    </div>
  );
};

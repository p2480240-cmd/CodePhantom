import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { ActivityDay } from '../types';

interface HeatmapGridProps {
  activityHistory: Record<string, ActivityDay>;
  compact?: boolean;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  activityHistory,
  compact = false,
}) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  // Month navigation: defaults to current month/year
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-indexed

  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
    visible: boolean;
  }>({ text: '', x: 0, y: 0, visible: false });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  // Build calendar matrix for selectedMonth / selectedYear
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
  // Adjust Monday = 0, Sunday = 6
  const startOffset = (firstDayOfWeek + 6) % 7;

  let monthTotalBugs = 0;
  let monthTotalXP = 0;
  let monthActiveDays = 0;

  const monthDaysList: { dayNumber: number; dateStr: string; data: ActivityDay }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(selectedMonth + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const dateStr = `${selectedYear}-${mm}-${dd}`;
    const dayData = activityHistory[dateStr] || {
      date: dateStr,
      count: 0,
      xp: 0,
      minutes: 0,
      challengesSolved: [],
      conceptsPracticed: [],
    };
    if (dayData.count > 0) {
      monthTotalBugs += dayData.count;
      monthTotalXP += dayData.xp;
      monthActiveDays += 1;
    }
    monthDaysList.push({ dayNumber: d, dateStr, data: dayData });
  }

  // LeetCode-style compact cell styling
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-slate-100 dark:bg-[#121a2f] hover:bg-slate-200 dark:hover:bg-[#1a2542] border border-slate-200/80 dark:border-white/5 text-slate-400 dark:text-white/30';
    if (count === 1) return 'bg-[#7c3aed] dark:bg-[#4c1d95] hover:bg-[#8b5cf6] dark:hover:bg-[#5b21b6] border border-[#a78bfa] dark:border-[#7c3aed] text-white shadow-sm';
    if (count === 2) return 'bg-[#9333ea] dark:bg-[#7c3aed] hover:bg-[#a855f7] dark:hover:bg-[#8b5cf6] border border-[#c084fc] dark:border-[#a78bfa] text-white shadow-sm';
    if (count <= 4) return 'bg-[#06b6d4] hover:bg-[#22d3ee] border border-[#22d3ee] text-black font-bold shadow-glow-cyan';
    return 'bg-[#22d3ee] hover:bg-white border border-white text-black font-extrabold shadow-glow-cyan';
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
        ? `${day.count} bugs solved (+${day.xp} XP) on ${formatted}`
        : `No activity on ${formatted}`;

    setTooltip({
      text: info,
      x: rect.left + rect.width / 2,
      y: rect.top - 38,
      visible: true,
    });
  };

  // Yearly data generator
  const today = new Date();
  const yearlyWeeks: { dateStr: string; day: ActivityDay }[][] = [];
  let currentWeek: { dateStr: string; day: ActivityDay }[] = [];
  const totalYearDays = 364;

  for (let i = totalYearDays - 1; i >= 0; i--) {
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
      yearlyWeeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return (
    <div className="relative w-full space-y-3 font-sans">
      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 px-3 py-1 text-[11px] font-mono text-white bg-slate-900/95 dark:bg-black/95 border border-purple-500/60 dark:border-phantom-cyan/60 rounded-lg shadow-2xl whitespace-nowrap"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Controls & Month Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-white/5 pb-2.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            title="Previous Month"
            className="p-1 rounded-md bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono px-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-purple-600 dark:text-phantom-cyan" />
            <span>{monthNames[selectedMonth]} {selectedYear}</span>
          </div>

          <button
            onClick={handleNextMonth}
            title="Next Month"
            className="p-1 rounded-md bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* LeetCode-style activity indicators */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-phantom-purple/20 text-purple-700 dark:text-phantom-violet border border-purple-300 dark:border-phantom-purple/30 font-semibold">
            {monthTotalBugs} Solved
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-phantom-amber/15 text-amber-700 dark:text-phantom-amber border border-amber-300 dark:border-phantom-amber/30 font-semibold">
            +{monthTotalXP} XP
          </span>
          {!compact && (
            <button
              onClick={() => setViewMode(viewMode === 'monthly' ? 'yearly' : 'monthly')}
              className="text-[10px] text-slate-500 dark:text-white/40 hover:text-purple-600 dark:hover:text-phantom-cyan underline ml-1"
            >
              {viewMode === 'monthly' ? 'Show Full Year' : 'Show Monthly'}
            </button>
          )}
        </div>
      </div>

      {/* MONTHLY CALENDAR: LEETCODE SIZED BOXES (Centered, Compact ~16px-20px square tiles) */}
      {viewMode === 'monthly' ? (
        <div className="flex flex-col items-center sm:items-start py-1">
          <div className="inline-block p-3 rounded-xl bg-slate-50 dark:bg-[#070b18] border border-slate-200 dark:border-white/10 shadow-inner">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono uppercase text-slate-500 dark:text-white/40 mb-1.5 font-semibold">
              <span className="w-5 text-center">Mo</span>
              <span className="w-5 text-center">Tu</span>
              <span className="w-5 text-center">We</span>
              <span className="w-5 text-center">Th</span>
              <span className="w-5 text-center">Fr</span>
              <span className="w-5 text-center">Sa</span>
              <span className="w-5 text-center">Su</span>
            </div>

            {/* LeetCode Grid of Days */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: startOffset }).map((_, idx) => (
                <div key={`offset-${idx}`} className="w-5 h-5 rounded-[3px] bg-transparent" />
              ))}

              {monthDaysList.map(({ dayNumber, data }) => (
                <div
                  key={data.date}
                  onMouseEnter={(e) => handleMouseEnter(e, data)}
                  onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                  className={`w-5 h-5 rounded-[3px] flex items-center justify-center text-[9px] font-mono transition-all cursor-pointer select-none ${getCellColor(
                    data.count
                  )}`}
                >
                  {dayNumber}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* YEARLY OVERVIEW VIEW (LeetCode Submission Matrix) */
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex gap-1 min-w-full p-2 bg-slate-50 dark:bg-[#070b18] rounded-xl border border-slate-200 dark:border-white/10">
            {yearlyWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((cell) => (
                  <div
                    key={cell.dateStr}
                    onMouseEnter={(e) => handleMouseEnter(e, cell.day)}
                    onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                    className={`w-3.5 h-3.5 rounded-[2px] transition-all cursor-pointer ${getCellColor(
                      cell.day.count
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/40 pt-2 border-t border-slate-200 dark:border-white/5 select-none font-mono">
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-slate-100 dark:bg-[#121a2f] border border-slate-300 dark:border-white/10" />
          <div className="w-3 h-3 rounded-[2px] bg-[#7c3aed]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#9333ea]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#06b6d4]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#22d3ee]" />
          <span>More</span>
        </div>

        <div className="text-[10px] text-slate-500 dark:text-white/40">
          {monthActiveDays} active days in {monthNames[selectedMonth]}
        </div>
      </div>
    </div>
  );
};

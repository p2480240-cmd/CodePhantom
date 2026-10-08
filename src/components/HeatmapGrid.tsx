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

  // Month navigation state: defaults to current month/year
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-indexed (0 = Jan, 9 = Oct)

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
  // Day of week of the 1st of this month (0 = Sun, 1 = Mon ... 6 = Sat)
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
  // Adjust so Monday = 0, Sunday = 6
  const startOffset = (firstDayOfWeek + 6) % 7;

  // Compute month summary statistics
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

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-[#0f172a]/60 hover:border-white/30 border border-white/5 text-white/40';
    if (count === 1) return 'bg-phantom-purple/40 border border-phantom-purple/70 text-white shadow-sm';
    if (count === 2) return 'bg-phantom-purple/80 border border-phantom-violet text-white shadow-sm';
    if (count <= 4) return 'bg-phantom-cyan/70 border border-phantom-cyan text-black font-bold shadow-glow-cyan';
    return 'bg-phantom-cyan border border-white text-black font-extrabold shadow-glow-cyan';
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
        ? `${day.count} bugs fixed (+${day.xp} XP) on ${formatted}`
        : `No activity on ${formatted}`;

    setTooltip({
      text: info,
      x: rect.left + rect.width / 2,
      y: rect.top - 38,
      visible: true,
    });
  };

  // Yearly data generator if user toggles yearly view
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
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 px-3 py-1.5 text-[11px] font-mono text-white bg-black/95 border border-phantom-cyan/60 rounded-lg shadow-2xl whitespace-nowrap"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Top Header: Month Switcher & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            title="Previous Month"
            className="p-1 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono px-1">
            <CalendarIcon className="w-3.5 h-3.5 text-phantom-cyan" />
            <span>{monthNames[selectedMonth]} {selectedYear}</span>
          </div>

          <button
            onClick={handleNextMonth}
            title="Next Month"
            className="p-1 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Month Quick Summary Pills */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-phantom-purple/20 text-phantom-violet border border-phantom-purple/30">
            {monthTotalBugs} bugs fixed
          </span>
          <span className="px-2 py-0.5 rounded bg-phantom-amber/15 text-phantom-amber border border-phantom-amber/30">
            +{monthTotalXP} XP
          </span>
          {!compact && (
            <button
              onClick={() => setViewMode(viewMode === 'monthly' ? 'yearly' : 'monthly')}
              className="text-[10px] text-white/40 hover:text-phantom-cyan underline ml-1"
            >
              {viewMode === 'monthly' ? 'Show Full Year' : 'Show Monthly'}
            </button>
          )}
        </div>
      </div>

      {/* MONTHLY CALENDAR VIEW (Default & Primary) */}
      {viewMode === 'monthly' ? (
        <div className="space-y-2">
          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono uppercase text-white/40 font-semibold py-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty offset spaces before 1st of month */}
            {Array.from({ length: startOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="aspect-square rounded-lg bg-transparent" />
            ))}

            {/* Actual Month Days */}
            {monthDaysList.map(({ dayNumber, data }) => (
              <div
                key={data.date}
                onMouseEnter={(e) => handleMouseEnter(e, data)}
                onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                className={`aspect-square min-h-[32px] sm:min-h-[36px] rounded-lg p-1 flex flex-col justify-between transition-all cursor-pointer select-none ${getCellColor(
                  data.count
                )}`}
              >
                <div className="text-[10px] sm:text-xs font-mono font-medium leading-none">
                  {dayNumber}
                </div>
                {data.count > 0 && (
                  <div className="text-[9px] font-mono leading-none self-end font-bold">
                    {data.count}★
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* YEARLY OVERVIEW VIEW (Fallback if requested) */
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex gap-1.5 min-w-full">
            {yearlyWeeks.map((week, wIdx) => (
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
      )}

      {/* Legend & Month Navigation Notice */}
      <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5 select-none font-mono">
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-[#0f172a]/80 border border-white/5" />
          <div className="w-2.5 h-2.5 rounded-sm bg-phantom-purple/40" />
          <div className="w-2.5 h-2.5 rounded-sm bg-phantom-purple/80" />
          <div className="w-2.5 h-2.5 rounded-sm bg-phantom-cyan/70" />
          <div className="w-2.5 h-2.5 rounded-sm bg-phantom-cyan" />
          <span>More</span>
        </div>

        <div className="text-[10px] text-white/40">
          {monthActiveDays} active days in {monthNames[selectedMonth]}
        </div>
      </div>
    </div>
  );
};

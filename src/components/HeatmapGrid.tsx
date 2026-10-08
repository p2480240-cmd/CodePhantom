import React, { useState, useMemo } from 'react';
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
  // 3 or 4 months expanded sideways (defaults to 4 on full view, 3 on compact)
  const [monthsCount, setMonthsCount] = useState<3 | 4>(compact ? 3 : 4);

  // Month navigation: defaults to current month/year as anchor end
  const now = new Date();
  const [anchorYear, setAnchorYear] = useState<number>(now.getFullYear());
  const [anchorMonth, setAnchorMonth] = useState<number>(now.getMonth()); // 0-indexed

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

  const handlePrevWindow = () => {
    let m = anchorMonth - monthsCount;
    let y = anchorYear;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    setAnchorMonth(m);
    setAnchorYear(y);
  };

  const handleNextWindow = () => {
    let m = anchorMonth + monthsCount;
    let y = anchorYear;
    while (m > 11) {
      m -= 12;
      y += 1;
    }
    setAnchorMonth(m);
    setAnchorYear(y);
  };

  const handlePrevSingleMonth = () => {
    if (anchorMonth === 0) {
      setAnchorMonth(11);
      setAnchorYear((prev) => prev - 1);
    } else {
      setAnchorMonth((prev) => prev - 1);
    }
  };

  const handleNextSingleMonth = () => {
    if (anchorMonth === 11) {
      setAnchorMonth(0);
      setAnchorYear((prev) => prev + 1);
    } else {
      setAnchorMonth((prev) => prev + 1);
    }
  };

  // Build the list of 3-4 consecutive months ending at anchorMonth/anchorYear
  const displayedMonths = useMemo(() => {
    const list = [];
    const count = compact ? 1 : monthsCount;
    for (let i = count - 1; i >= 0; i--) {
      let m = anchorMonth - i;
      let y = anchorYear;
      while (m < 0) {
        m += 12;
        y -= 1;
      }
      while (m > 11) {
        m -= 12;
        y += 1;
      }
      list.push({ year: y, month: m });
    }
    return list;
  }, [anchorYear, anchorMonth, monthsCount, compact]);

  // Compute month matrix data for each displayed month
  const monthsData = useMemo(() => {
    return displayedMonths.map(({ year, month }) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfWeek = new Date(year, month, 1).getDay();
      // Adjust Monday = 0, Sunday = 6
      const startOffset = (firstDayOfWeek + 6) % 7;

      let monthTotalBugs = 0;
      let monthTotalXP = 0;
      let monthActiveDays = 0;

      const daysList: { dayNumber: number; dateStr: string; data: ActivityDay }[] = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        const dateStr = `${year}-${mm}-${dd}`;
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
        daysList.push({ dayNumber: d, dateStr, data: dayData });
      }

      return {
        year,
        month,
        name: monthNames[month],
        startOffset,
        daysList,
        monthTotalBugs,
        monthTotalXP,
        monthActiveDays,
      };
    });
  }, [displayedMonths, activityHistory]);

  // Aggregated totals across all displayed months
  const totalWindowBugs = monthsData.reduce((acc, m) => acc + m.monthTotalBugs, 0);
  const totalWindowXP = monthsData.reduce((acc, m) => acc + m.monthTotalXP, 0);
  const totalWindowActiveDays = monthsData.reduce((acc, m) => acc + m.monthActiveDays, 0);

  const firstMonth = monthsData[0];
  const lastMonth = monthsData[monthsData.length - 1];

  // LeetCode-style compact cell styling
  const getCellColor = (count: number) => {
    if (count === 0)
      return 'bg-slate-100 dark:bg-[#121a2f] hover:bg-slate-200 dark:hover:bg-[#1a2542] border border-slate-200/80 dark:border-white/5 text-slate-400 dark:text-white/30';
    if (count === 1)
      return 'bg-[#7c3aed] dark:bg-[#4c1d95] hover:bg-[#8b5cf6] dark:hover:bg-[#5b21b6] border border-[#a78bfa] dark:border-[#7c3aed] text-white shadow-sm';
    if (count === 2)
      return 'bg-[#9333ea] dark:bg-[#7c3aed] hover:bg-[#a855f7] dark:hover:bg-[#8b5cf6] border border-[#c084fc] dark:border-[#a78bfa] text-white shadow-sm';
    if (count <= 4)
      return 'bg-[#06b6d4] hover:bg-[#22d3ee] border border-[#22d3ee] text-black font-bold shadow-glow-cyan';
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

  // Yearly data generator (52-week matrix)
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

  // If compact mode is requested (e.g. on Landing Page home card), render only one month (the current month)
  if (compact) {
    const curYear = today.getFullYear();
    const curMonthIdx = today.getMonth();
    const curMonthName = monthNames[curMonthIdx];
    const daysInCurMonth = new Date(curYear, curMonthIdx + 1, 0).getDate();
    const firstDayOfWeek = new Date(curYear, curMonthIdx, 1).getDay();
    // Adjust Monday = 0, Sunday = 6
    const startOffset = (firstDayOfWeek + 6) % 7;
    const todayStr = today.toISOString().split('T')[0];

    let currentMonthActiveDays = 0;
    const daysList: { dayNumber: number; dateStr: string; data: ActivityDay }[] = [];

    for (let d = 1; d <= daysInCurMonth; d++) {
      const mm = String(curMonthIdx + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${curYear}-${mm}-${dd}`;
      const dayData = activityHistory[dateStr] || {
        date: dateStr,
        count: 0,
        xp: 0,
        minutes: 0,
        challengesSolved: [],
        conceptsPracticed: [],
      };
      if (dayData.count > 0) {
        currentMonthActiveDays++;
      }
      daysList.push({ dayNumber: d, dateStr, data: dayData });
    }

    return (
      <div className="relative w-full space-y-2.5 font-sans">
        {/* Floating Tooltip */}
        {tooltip.visible && (
          <div
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 px-2.5 py-1 text-[11px] font-mono text-white bg-slate-900/95 dark:bg-black/95 border border-purple-500/60 dark:border-phantom-cyan/60 rounded-lg shadow-xl whitespace-nowrap"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            {tooltip.text}
          </div>
        )}

        {/* Current Month Header */}
        <div className="flex items-center justify-between pb-1 text-xs font-mono">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
            <CalendarIcon className="w-3.5 h-3.5 text-purple-600 dark:text-phantom-cyan" />
            <span>{curMonthName} {curYear}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-phantom-teal/15 text-teal-700 dark:text-phantom-teal font-semibold">
            {currentMonthActiveDays} active days
          </span>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono uppercase text-slate-400 dark:text-white/40 font-semibold select-none">
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>Su</span>
        </div>

        {/* Current Month Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 place-items-center">
          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="w-6 h-6 sm:w-7 sm:h-7 rounded-[4px] bg-transparent" />
          ))}

          {daysList.map(({ dayNumber, dateStr, data }) => {
            const isToday = dateStr === todayStr;
            return (
              <div
                key={dateStr}
                onMouseEnter={(e) => handleMouseEnter(e, data)}
                onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[4px] flex items-center justify-center text-[10px] font-mono transition-all cursor-pointer select-none font-medium ${getCellColor(
                  data.count
                )} ${
                  isToday ? 'ring-2 ring-cyan-500 dark:ring-phantom-cyan font-bold' : ''
                }`}
              >
                {dayNumber}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/40 pt-2 border-t border-slate-200 dark:border-white/5 select-none font-mono">
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-[#121a2f] border border-slate-200 dark:border-white/10" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#7c3aed] dark:bg-[#4c1d95]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#9333ea] dark:bg-[#7c3aed]" />
            <div className="w-2.5 h-2.5 rounded-sm bg-[#06b6d4]" />
            <span>More</span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-white/70">Current Month</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-3.5 font-sans">
      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 px-3 py-1 text-[11px] font-mono text-white bg-slate-900/95 dark:bg-black/95 border border-purple-500/60 dark:border-phantom-cyan/60 rounded-lg shadow-2xl whitespace-nowrap"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Controls & Range Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Shift back */}
          <button
            onClick={handlePrevSingleMonth}
            title="Previous Month"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono px-1">
            <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-phantom-cyan" />
            <span>
              {displayedMonths.length === 1
                ? `${lastMonth?.name} ${lastMonth?.year}`
                : `${firstMonth?.name} ${firstMonth?.year !== lastMonth?.year ? firstMonth?.year : ''} – ${lastMonth?.name} ${lastMonth?.year}`}
            </span>
          </div>

          {/* Shift forward */}
          <button
            onClick={handleNextSingleMonth}
            title="Next Month"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-black/40 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* LeetCode-style activity indicators and 3/4 month toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-phantom-purple/20 text-purple-700 dark:text-phantom-violet border border-purple-300 dark:border-phantom-purple/30 font-semibold shadow-sm">
            {totalWindowBugs} Solved
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-phantom-amber/15 text-amber-700 dark:text-phantom-amber border border-amber-300 dark:border-phantom-amber/30 font-semibold shadow-sm">
            +{totalWindowXP} XP
          </span>

          {!compact && (
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 ml-1">
              <button
                onClick={() => {
                  setViewMode('monthly');
                  setMonthsCount(3);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  viewMode === 'monthly' && monthsCount === 3
                    ? 'bg-purple-600 dark:bg-phantom-purple text-white shadow-sm'
                    : 'text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                3 Months
              </button>
              <button
                onClick={() => {
                  setViewMode('monthly');
                  setMonthsCount(4);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  viewMode === 'monthly' && monthsCount === 4
                    ? 'bg-purple-600 dark:bg-phantom-purple text-white shadow-sm'
                    : 'text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                4 Months
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'yearly' ? 'monthly' : 'yearly')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  viewMode === 'yearly'
                    ? 'bg-cyan-600 dark:bg-phantom-cyan text-white dark:text-black shadow-sm'
                    : 'text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Full Year
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MONTHLY CALENDAR: 3-4 MONTHS EXPANDED SIDEWAYS TO FILL THE WHOLE SPACE */}
      {viewMode === 'monthly' ? (
        <div
          className={`grid gap-3.5 w-full ${
            compact
              ? 'grid-cols-1 sm:grid-cols-2'
              : monthsCount === 3
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {monthsData.map((m) => (
            <div
              key={`${m.year}-${m.month}`}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070b18] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between transition-colors"
            >
              <div>
                {/* Individual Month Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-2 mb-2.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white font-mono">
                    {m.name} {m.year}
                  </span>
                  {m.monthActiveDays > 0 ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-phantom-teal/15 text-teal-700 dark:text-phantom-teal font-semibold">
                      {m.monthActiveDays} active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-white/30">
                      0 active
                    </span>
                  )}
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono uppercase text-slate-500 dark:text-white/40 mb-1.5 font-semibold">
                  <span className="w-full text-center">Mo</span>
                  <span className="w-full text-center">Tu</span>
                  <span className="w-full text-center">We</span>
                  <span className="w-full text-center">Th</span>
                  <span className="w-full text-center">Fr</span>
                  <span className="w-full text-center">Sa</span>
                  <span className="w-full text-center">Su</span>
                </div>

                {/* LeetCode Day Boxes Grid */}
                <div className="grid grid-cols-7 gap-1 place-items-center">
                  {Array.from({ length: m.startOffset }).map((_, idx) => (
                    <div key={`offset-${idx}`} className="w-5 h-5 rounded-[3px] bg-transparent" />
                  ))}

                  {m.daysList.map(({ dayNumber, data }) => (
                    <div
                      key={data.date}
                      onMouseEnter={(e) => handleMouseEnter(e, data)}
                      onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                      className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-[3px] flex items-center justify-center text-[9px] font-mono transition-all cursor-pointer select-none ${getCellColor(
                        data.count
                      )}`}
                    >
                      {dayNumber}
                    </div>
                  ))}
                </div>
              </div>

              {/* Month Mini Footer with Bug & XP summary */}
              <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-white/40">
                <span>{m.monthTotalBugs} solved</span>
                <span className="text-amber-600 dark:text-phantom-amber font-medium">+{m.monthTotalXP} XP</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* YEARLY OVERVIEW VIEW (LeetCode 52-Week Submission Matrix) */
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex gap-1 min-w-full p-3 bg-slate-50 dark:bg-[#070b18] rounded-2xl border border-slate-200 dark:border-white/10">
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

      {/* Legend & Period Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-white/40 pt-2.5 border-t border-slate-200 dark:border-white/5 select-none font-mono">
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-slate-100 dark:bg-[#121a2f] border border-slate-300 dark:border-white/10" />
          <div className="w-3 h-3 rounded-[2px] bg-[#7c3aed]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#9333ea]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#06b6d4]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#22d3ee]" />
          <span>More</span>
        </div>

        <div className="text-[10px] text-slate-500 dark:text-white/40 font-medium">
          {totalWindowActiveDays} active days recorded across this {monthsCount}-month period
        </div>
      </div>
    </div>
  );
};

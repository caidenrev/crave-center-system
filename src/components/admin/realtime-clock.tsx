"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function RealtimeClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client side to avoid hydration mismatch
    setTime(new Date());
    
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Show a static placeholder matching the layout before hydration to prevent layout shift
  if (!time) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm h-full flex flex-col justify-between group min-h-[220px]">
        <div className="relative z-10">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Time Tracker
          </h3>
        </div>
      </div>
    );
  }

  const timeString = time.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const dateString = time.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }).toUpperCase();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm h-full flex flex-col justify-between group min-h-[220px]">
      <div className="relative z-10">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Time Tracker
        </h3>
      </div>
      
      <div className="relative z-10 text-center py-2">
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
          {timeString}
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium tracking-wide uppercase">
          {dateString}
        </p>
      </div>
      
      <div className="relative z-10 flex justify-between gap-1 mt-2">
        {/* Mini Calendar Strip */}
        {[-2, -1, 0, 1, 2].map((offset) => {
          const d = new Date(time); // Use the state time to prevent hydration mismatch
          d.setDate(d.getDate() + offset);
          const isToday = offset === 0;
          return (
            <div 
              key={offset} 
              className={`flex flex-col items-center justify-center w-8 h-10 rounded-lg transition-colors ${
                isToday 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`text-[8px] uppercase font-bold ${isToday ? 'text-white/90' : ''}`}>
                {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
              </span>
              <span className={`text-xs font-bold ${isToday ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                {d.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

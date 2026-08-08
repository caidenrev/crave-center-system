'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Clock } from 'lucide-react'

type Project = {
  id: string
  title: string
  status: string
  createdAt?: string
  targetDeliveryDate: string | null
}

export function ClientCalendar({ projects }: { projects: Project[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [time, setTime] = useState<Date>(() => new Date())
  const [mounted, setMounted] = useState(false)
  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    projects: Project[];
  } | null>(null)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const days = []
  
  // previous month trailing days
  const prevMonthDays = getDaysInMonth(year, month - 1)
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: prevMonthDays - firstDay + i + 1, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - firstDay + i + 1) })
  }

  // current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) })
  }

  // next month leading days
  const remainingCells = 42 - days.length
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) })
  }

  const getProjectsForDay = (d: { date: Date; isCurrentMonth: boolean }) => {
    if (!d.isCurrentMonth) return []
    return projects.filter(p => {
      if (!p.targetDeliveryDate || !p.createdAt) return false;
      const start = new Date(p.createdAt);
      start.setHours(0, 0, 0, 0);
      const end = new Date(p.targetDeliveryDate);
      end.setHours(23, 59, 59, 999);
      const current = new Date(d.date);
      current.setHours(12, 0, 0, 0);
      return current >= start && current <= end;
    })
  }

  const dayProjectsList = days.map(d => getProjectsForDay(d))

  const getPillColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 dark:bg-emerald-500/20'
      case 'IN_PROGRESS': return 'bg-sky-100 dark:bg-sky-500/20'
      case 'PENDING_DP': return 'bg-primary/15 dark:bg-primary/20'
      case 'CANCELLED': return 'bg-red-100 dark:bg-red-500/20'
      case 'REQUESTED': return 'bg-indigo-100 dark:bg-indigo-500/20'
      case 'WORKER_REVIEW': return 'bg-purple-100 dark:bg-purple-500/20'
      default: return 'bg-blue-50 dark:bg-slate-400/20'
    }
  }

  const getCircleColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500 text-white shadow-emerald-500/30'
      case 'IN_PROGRESS': return 'bg-sky-500 text-white shadow-sky-500/30'
      case 'PENDING_DP': return 'bg-primary text-white shadow-primary/30'
      case 'CANCELLED': return 'bg-red-500 text-white shadow-red-500/30'
      case 'REQUESTED': return 'bg-indigo-500 text-white shadow-indigo-500/30'
      case 'WORKER_REVIEW': return 'bg-purple-500 text-white shadow-purple-500/30'
      default: return 'bg-slate-500 text-white shadow-slate-500/30'
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-3 md:p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative">
      <div className="flex items-center justify-between mb-5 px-0.5">
        <button onClick={prevMonth} className="p-1 md:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex flex-col items-center flex-1 mx-1 truncate">
          <h2 className="text-base sm:text-lg md:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-1 md:gap-2">
            <span className="truncate">{monthNames[month]}</span> <span className="text-primary/80 font-normal">{year}</span>
          </h2>
          <div suppressHydrationWarning className="text-[9px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 md:mt-1.5 bg-slate-50 dark:bg-slate-800/60 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-slate-100 dark:border-slate-700/50 tabular-nums tracking-wider whitespace-nowrap">
            {mounted && time ? time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
          </div>
        </div>
        <button onClick={nextMonth} className="p-1 md:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 md:gap-y-4 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
           <div key={day} className="text-[8px] md:text-[11px] uppercase font-bold text-slate-400 mb-0.5">{day}</div>
        ))}
        
        {days.map((d, i) => {
          const isToday = d.isCurrentMonth && d.date.toDateString() === new Date().toDateString()
          const dayProjects = dayProjectsList[i]
          const prevHasProject = i > 0 && dayProjectsList[i - 1].length > 0
          const nextHasProject = i < days.length - 1 && dayProjectsList[i + 1].length > 0

          let bgClass = '';
          let pillStyle = '';
          let circleClass = '';

          if (dayProjects.length > 0) {
            const p = dayProjects[0];
            const startStr = p.createdAt ? new Date(p.createdAt).toDateString() : '';
            const endStr = p.targetDeliveryDate ? new Date(p.targetDeliveryDate).toDateString() : '';
            const currStr = d.date.toDateString();

            const isStart = startStr === currStr;
            const isEnd = endStr === currStr;
            
            bgClass = getPillColor(p.status);

            if (isStart || isEnd) {
              circleClass = getCircleColor(p.status) + ' shadow-md';
            }

            const connectLeft = prevHasProject;
            const connectRight = nextHasProject;

            if (!connectLeft && !connectRight) {
              pillStyle = 'w-7 md:w-9 left-1/2 -translate-x-1/2 rounded-full';
            } else if (!connectLeft && connectRight) {
              pillStyle = 'left-[calc(50%-14px)] md:left-[calc(50%-18px)] right-0 rounded-l-full rounded-r-none';
            } else if (connectLeft && !connectRight) {
              pillStyle = 'right-[calc(50%-14px)] md:right-[calc(50%-18px)] left-0 rounded-r-full rounded-l-none';
            } else {
              pillStyle = 'left-0 right-0 w-full rounded-none';
            }
          }

          return (
            <div 
              key={i} 
              onClick={() => {
                if (dayProjects.length > 0) {
                  setSelectedDay({ date: d.date, projects: dayProjects });
                }
              }}
              className={`flex flex-col items-center justify-center min-h-[40px] md:min-h-[50px] relative group transition-colors ${dayProjects.length > 0 ? 'cursor-pointer hover:opacity-90' : ''}`}
            >
              {bgClass && (
                <div className={`absolute top-1/2 -translate-y-1/2 h-7 md:h-9 ${bgClass} ${pillStyle}`} />
              )}
              <div className={`relative z-10 text-[12px] md:text-[15px] font-medium flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full transition-all ${
                  circleClass ? circleClass : 
                  isToday ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md shadow-slate-900/30' : 
                  d.isCurrentMonth ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300 dark:text-slate-600'
                }`}
              >
                {d.day < 10 ? `0${d.day}` : d.day}
              </div>
            </div>
          )
        })}
      </div>

      {/* Project Details Modal Popup */}
      {selectedDay && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedDay(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight">
                    Detail Projek
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {selectedDay.date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDay(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3.5 max-h-[60vh] overflow-y-auto pr-1">
              {selectedDay.projects.map((proj) => {
                const getStatusBadge = (status: string) => {
                  switch (status) {
                    case 'COMPLETED': return { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' }
                    case 'IN_PROGRESS': return { label: 'Berjalan', color: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300' }
                    case 'PENDING_DP': return { label: 'Menunggu DP', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' }
                    case 'WORKER_REVIEW': return { label: 'Review Worker', color: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' }
                    case 'REQUESTED': return { label: 'Pengajuan', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' }
                    case 'CANCELLED': return { label: 'Dibatalkan', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' }
                    default: return { label: status, color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' }
                  }
                }
                const badge = getStatusBadge(proj.status)
                const startDateStr = proj.createdAt ? new Date(proj.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
                const endDateStr = proj.targetDeliveryDate ? new Date(proj.targetDeliveryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

                return (
                  <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium font-mono">#{proj.id.slice(-6)}</span>
                    </div>

                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {proj.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{startDateStr} &mdash; {endDateStr}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

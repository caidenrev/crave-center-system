"use client"

import { motion } from "framer-motion"
import { ComponentType } from "react"

export type TabType = "profile" | "notifications" | "rules" | "security"

export interface TabItem {
  id: TabType
  label: string
  icon: ComponentType<{ className?: string }>
}

interface SettingsTabNavProps {
  tabs: TabItem[]
  activeTab: TabType
  onSelectTab: (id: TabType) => void
}

export function SettingsTabNav({ tabs, activeTab, onSelectTab }: SettingsTabNavProps) {
  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
      <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "text-primary dark:text-primary font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSettingTab"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl border border-primary/20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 relative z-10 ${isActive ? "text-primary" : "text-slate-400"}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

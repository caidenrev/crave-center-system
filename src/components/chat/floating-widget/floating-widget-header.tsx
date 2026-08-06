"use client"

import { MessageSquare, X, Users, FolderKanban } from "lucide-react"
import { useChatTranslations } from "../chat-i18n"

interface FloatingWidgetHeaderProps {
  activeTab: "DIRECT" | "PROJECTS"
  onTabChange: (tab: "DIRECT" | "PROJECTS") => void
  onClose: () => void
  showTabs: boolean
}

export function FloatingWidgetHeader({
  activeTab,
  onTabChange,
  onClose,
  showTabs,
}: FloatingWidgetHeaderProps) {
  const { t } = useChatTranslations()

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shrink-0">
      {/* Top Title Bar */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 flex items-center justify-center text-primary shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold tracking-tight text-slate-900 dark:text-white">{t.liveChatSupport}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Pusat Komunikasi Crave ITSM</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sleek Segmented Tab Switcher */}
      {showTabs && (
        <div className="px-3 pb-3">
          <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80 gap-1">
            <button
              type="button"
              onClick={() => onTabChange("DIRECT")}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "DIRECT"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> {t.directChat}
            </button>
            <button
              type="button"
              onClick={() => onTabChange("PROJECTS")}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "PROJECTS"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" /> {t.projectDiscussion}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Plus, X, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { updateWorkerProfile } from "@/app/actions/worker"

interface WorkerSkillsTabProps {
  initialSkills: string[]
}

export function WorkerSkillsTab({ initialSkills }: WorkerSkillsTabProps) {
  const t = useTranslations("WorkerSettings")
  const [skills, setSkills] = useState<string[]>(initialSkills || [])
  const [newSkill, setNewSkill] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleAddSkill = () => {
    if (!newSkill.trim()) return
    if (skills.includes(newSkill.trim())) {
      toast.error("Skill already added")
      return
    }
    setSkills([...skills, newSkill.trim()])
    setNewSkill("")
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await updateWorkerProfile({
        name: "", // handled by endpoint merge or backend
        skills,
      })
      if (res.success) {
        toast.success(t("profileSaved"))
      } else {
        toast.error(res.error || t("profileError"))
      }
    } catch {
      toast.error(t("profileError"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      key="skills"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("skillsTitle")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("skillsDesc")}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 pt-2">
        <div className="flex gap-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder={t("addSkillPlaceholder")}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddSkill()
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/20 transition-all"
          >
            <Plus className="w-4 h-4" /> {t("addBtn")}
          </button>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 min-h-36">
          <div className="flex flex-wrap gap-2.5">
            {skills.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">{t("noSkills")}</p>
            ) : (
              skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 text-xs font-semibold shadow-2xs"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-indigo-400 hover:text-indigo-600 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t("saveSkills")}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

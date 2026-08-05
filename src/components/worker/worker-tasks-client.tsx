"use client";

import { useState } from "react";
import {
  Search,
  X,
  Clock,
  CheckCircle2,
  Circle,
  Eye,
  Calendar,
  ChevronDown,
  Plus,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createWorkerTask } from "@/app/actions/worker";

interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  projectTitle: string;
  clientName: string;
  estimatedTime: number | null;
  actualTime: number | null;
  deadline: string | null;
  completedAt: string | null;
  createdAt: string;
}

export function WorkerTasksClient({ 
  tasks,
  activeProjects = []
}: { 
  tasks: TaskItem[];
  activeProjects?: { id: string; title: string }[];
}) {
  const t = useTranslations("WorkerDashboard");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  
  // Create Task Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "TO_DO":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {t("toDo")}
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
            {t("inProgress")}
          </span>
        );
      case "REVIEW":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
            {t("review")}
          </span>
        );
      case "DONE":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
            {t("done")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {status}
          </span>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "REVIEW":
        return <Eye className="w-4 h-4 text-amber-500" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  async function handleCreateTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await createWorkerTask(formData);
    setIsSubmitting(false);

    if (res.success) {
      setShowCreateModal(false);
      router.refresh();
    } else {
      alert("Error creating task: " + res.error);
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-2xl shadow-md shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Tugas
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2">
          {[
            { id: "ALL", label: "All" },
            { id: "TO_DO", label: t("toDo") },
            { id: "IN_PROGRESS", label: t("inProgress") },
            { id: "REVIEW", label: t("review") },
            { id: "DONE", label: t("done") },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === f.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500">No tasks found.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {task.projectTitle} • {task.clientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {task.deadline && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                  {getStatusBadge(task.status)}
                </div>
              </div>

              {task.estimatedTime && (
                <div className="flex items-center gap-4 mt-3 pl-7">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Est: {task.estimatedTime}h
                  </span>
                  {task.actualTime && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Actual: {task.actualTime}h
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-6 mb-6">
              <div className="mb-3">{getStatusBadge(selectedTask.status)}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {selectedTask.title}
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
                {selectedTask.projectTitle} • {selectedTask.clientName}
              </p>
            </div>

            {selectedTask.description && (
              <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedTask.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              {selectedTask.estimatedTime && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    Estimated
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedTask.estimatedTime} hours
                  </p>
                </div>
              )}
              {selectedTask.deadline && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                    Deadline
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {new Date(selectedTask.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                Tambah Tugas Baru
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Buat tugas baru untuk proyek yang sedang berjalan.
              </p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Proyek</label>
                <select 
                  name="projectId" 
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
                >
                  <option value="">Pilih Proyek...</option>
                  {activeProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Judul Tugas</label>
                <input 
                  type="text"
                  name="title" 
                  required
                  placeholder="e.g. Desain Homepage"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Deskripsi (Opsional)</label>
                <textarea 
                  name="description" 
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Estimasi Waktu (Jam)</label>
                  <input 
                    type="number"
                    name="estimatedTime" 
                    min="1"
                    placeholder="2"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tenggat / Deadline</label>
                  <input 
                    type="date"
                    name="deadline" 
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                      Menyimpan...
                    </>
                  ) : (
                    "Buat Tugas"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


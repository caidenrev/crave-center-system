"use client";

import { useState } from "react";
import {
  Search,
  X,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectItem {
  id: string;
  fullId: string;
  name: string;
  client: string;
  status: string;
  progress: number;
  dueDate: string;
  description: string;
  totalTasks: number;
  doneTasks: number;
  budget?: string;
}

export function WorkerProjectsClient({ projects }: { projects: ProjectItem[] }) {
  const t = useTranslations("WorkerDashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      IN_PROGRESS: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
      COMPLETED: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
      ON_HOLD: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
      REQUESTED: "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
      WORKER_REVIEW: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20",
      PENDING_DP: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20",
      IN_WARRANTY: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-500/20",
    };
    const labels: Record<string, string> = {
      IN_PROGRESS: t("inProgress"),
      COMPLETED: t("done"),
      ON_HOLD: "On Hold",
      REQUESTED: "Requested",
      WORKER_REVIEW: t("review"),
      PENDING_DP: "Pending DP",
      IN_WARRANTY: "Warranty",
    };
    const style = styles[status] || styles.REQUESTED;
    const label = labels[status] || status;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${style}`}>
        {label}
      </span>
    );
  };

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "ALL", label: "All" },
            { id: "IN_PROGRESS", label: t("inProgress") },
            { id: "COMPLETED", label: t("done") },
            { id: "ON_HOLD", label: "On Hold" },
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

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500">{t("noProjects")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.fullId}
              onClick={() => setSelectedProject(proj)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 tracking-wider">
                  {proj.id}
                </span>
                {getStatusBadge(proj.status)}
              </div>

              <div className="space-y-1 mb-5">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t("client")}: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{proj.client}</strong>
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                {/* Arch gauge progress */}
                <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("completion")}</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 leading-none">{proj.progress}%</span>
                  </div>
                  <div className="relative w-[72px] h-[36px] flex items-end justify-center">
                    <svg className="w-full h-full drop-shadow-sm overflow-visible" viewBox="0 0 100 50">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="12" strokeLinecap="round" />
                      {proj.progress > 0 && (
                        <path
                          d="M 10 50 A 40 40 0 0 1 90 50"
                          fill="none"
                          className={proj.progress === 100 ? "stroke-emerald-500" : proj.status === "ON_HOLD" ? "stroke-amber-500" : "stroke-blue-500"}
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(proj.progress / 100) * (Math.PI * 40)} ${Math.PI * 40}`}
                        />
                      )}
                    </svg>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> Due: {proj.dueDate}
                  </span>
                  <span className="text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    {t("viewProject")} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-6 mb-5">
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                {selectedProject.id}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">{selectedProject.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("client")}: {selectedProject.client}</p>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Status</span>
                {getStatusBadge(selectedProject.status)}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Due Date</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedProject.dueDate}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Tasks</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedProject.doneTasks}/{selectedProject.totalTasks} completed</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-xs block mb-1.5">{t("completion")} ({selectedProject.progress}%)</span>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${selectedProject.progress}%` }} />
                </div>
              </div>
            </div>

            {selectedProject.description && (
              <div className="mb-5">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-6">
                  {selectedProject.description}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import {
  Search,
  X,
  ChevronRight,
  Calendar,
  MessageSquare,
  LayoutGrid,
  List,
  CircleDashed,
  PlayCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  ShieldCheck,
  FileText,
  Send,
  Download,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WorkerReviewAlert } from "@/components/worker/alerts/worker-review-alert";
import { ProjectChatDrawer } from "@/components/chat/project-chat/project-chat-drawer";
import { submitWorkerOffer } from "@/app/actions/worker";

interface ProjectItem {
  id: string;
  fullId: string;
  name: string;
  client: string;
  status: string;
  progress: number;
  dueDate: string;
  description: string;
  briefFileUrl?: string | null;
  offeredPrice?: number | null;
  offeredDuration?: number | null;
  terms?: {
    id: string;
    scope: string;
    priceFinal: number;
    status: string;
    approvedByClient: boolean;
  } | null;
  totalTasks: number;
  doneTasks: number;
  budget?: string;
}

export function WorkerProjectsClient({
  projects,
  currentUserId,
}: {
  projects: ProjectItem[];
  currentUserId?: string;
}) {
  const t = useTranslations("WorkerDashboard");
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [chatProject, setChatProject] = useState<ProjectItem | null>(null);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleQuoteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedProject) return;
    setIsSubmittingOffer(true);

    const formData = new FormData(e.currentTarget);
    formData.append("projectId", selectedProject.fullId);

    const res = await submitWorkerOffer(formData);
    setIsSubmittingOffer(false);

    if (res.success) {
      toast.success("Penawaran berhasil dikirim/diperbarui!");
      setShowOfferForm(false);
      setSelectedProject(null);
      router.refresh();
    } else {
      toast.error("Error: " + res.error);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
      case "Requested":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white shadow-xs">
            <CircleDashed className="w-3.5 h-3.5" /> {t("statusRequested") || "Diajukan"}
          </span>
        );
      case "IN_PROGRESS":
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
            <PlayCircle className="w-3.5 h-3.5" /> {t("statusInProgress") || t("inProgress") || "Berlangsung"}
          </span>
        );
      case "WORKER_REVIEW":
      case "Worker Review":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
            <AlertCircle className="w-3.5 h-3.5" /> {t("statusWorkerReview") || "Worker Review"}
          </span>
        );
      case "PENDING_DP":
      case "Pending DP":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500 text-white shadow-xs">
            <Clock className="w-3.5 h-3.5" /> {t("statusPendingDP") || "Menunggu DP"}
          </span>
        );
      case "COMPLETED":
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
            <CheckCircle className="w-3.5 h-3.5" /> {t("statusCompleted") || t("done") || "Selesai"}
          </span>
        );
      case "ON_HOLD":
      case "Delayed":
      case "On Hold":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-xs">
            <Clock className="w-3.5 h-3.5" /> {t("statusOnHold") || "Tertunda / Jeda"}
          </span>
        );
      case "IN_WARRANTY":
      case "Warranty":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500 text-white shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> {t("statusInWarranty") || "Garansi"}
          </span>
        );
      case "CANCELLED":
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-xs">
            <AlertCircle className="w-3.5 h-3.5" /> {t("statusCancelled") || "Dibatalkan"}
          </span>
        );
      default:
        const formattedStatus = status ? status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : status;
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-white shadow-xs">
            <CircleDashed className="w-3.5 h-3.5" /> {formattedStatus}
          </span>
        );
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-5 shadow-xs space-y-4">
        
        {/* Top Row: Search Input & View Switcher */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder") || "Cari nama proyek, klien, atau ID..."}
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

          <div className="flex items-center justify-end">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                suppressHydrationWarning
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-primary shadow-xs"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                suppressHydrationWarning
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-primary shadow-xs"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800/80 pt-3">
          {[
            { id: "ALL", label: t("filterAll") || "All" },
            { id: "WORKER_REVIEW", label: t("statusWorkerReview") || "Worker Review" },
            { id: "PENDING_DP", label: t("statusPendingDP") || "Pending DP" },
            { id: "IN_PROGRESS", label: t("statusInProgress") || t("inProgress") },
            { id: "ON_HOLD", label: t("statusOnHold") || "On Hold" },
            { id: "IN_WARRANTY", label: t("statusInWarranty") || "Warranty" },
            { id: "COMPLETED", label: t("statusCompleted") || t("done") },
            { id: "CANCELLED", label: t("statusCancelled") || "Cancelled" },
          ].map((f) => (
            <button
              key={f.id}
              suppressHydrationWarning
              onClick={() => setStatusFilter(f.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                statusFilter === f.id
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-500">{t("noProjects")}</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const isWorkerReview = proj.status === "WORKER_REVIEW";

            return (
              <div
                key={proj.fullId}
                onClick={() => {
                  setSelectedProject(proj);
                  setShowOfferForm(isWorkerReview);
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer group"
              >
                <div>
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

                  <div className="space-y-4 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                    {/* Arch gauge progress */}
                    <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl shadow-sm">
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

                    <div className="pt-3 mt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-primary" /> {t("deadline") || "Tenggat"}:
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{proj.dueDate}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          disabled={proj.status === "CANCELLED"}
                          onClick={() => proj.status !== "CANCELLED" && setChatProject(proj)}
                          className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            proj.status === "CANCELLED"
                              ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs border-none cursor-pointer"
                          }`}
                          title={proj.status === "CANCELLED" ? "Pesan nonaktif untuk proyek yang dibatalkan" : undefined}
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span>{t("btnChat") || "Pesan"}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProject(proj);
                            setShowOfferForm(isWorkerReview);
                          }}
                          className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs ${
                            isWorkerReview
                              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                              : "bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80"
                          }`}
                        >
                          <span>{isWorkerReview ? "Beri Penawaran" : t("btnDetail") || t("viewProject") || "Detail"}</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 uppercase text-slate-500 dark:text-slate-400 font-bold text-xs border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nama Proyek</th>
                  <th className="px-6 py-4">{t("client")}</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">{t("completion")}</th>
                  <th className="px-6 py-4">{t("deadline") || "Tenggat"}</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProjects.map((p) => {
                  const isWorkerReview = p.status === "WORKER_REVIEW";

                  return (
                    <tr key={p.fullId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-slate-900 dark:text-slate-200">{p.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                      <td className="px-6 py-4">{p.client}</td>
                      <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.progress}%</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium text-xs">{p.dueDate}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={p.status === "CANCELLED"}
                            onClick={() => p.status !== "CANCELLED" && setChatProject(p)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                              p.status === "CANCELLED"
                                ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                            }`}
                            title={p.status === "CANCELLED" ? "Pesan nonaktif untuk proyek yang dibatalkan" : undefined}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{t("btnChat") || "Pesan"}</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProject(p);
                              setShowOfferForm(isWorkerReview);
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              isWorkerReview
                                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            {isWorkerReview ? "Penawaran" : t("btnDetail") || t("viewProject") || "Detail"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Detail & Offer Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 md:p-8 max-w-xl w-full shadow-2xl relative flex flex-col max-h-[85vh] overflow-y-auto custom-scrollbar border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setSelectedProject(null);
                setShowOfferForm(false);
              }}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-10 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {selectedProject.id}
                </span>
                {getStatusBadge(selectedProject.status)}
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">{selectedProject.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("client")}: <strong className="text-slate-800 dark:text-slate-200">{selectedProject.client}</strong></p>
            </div>

            {/* If WORKER_REVIEW status, display review notice */}
            {selectedProject.status === "WORKER_REVIEW" && (
              <WorkerReviewAlert 
                offeredPrice={selectedProject.offeredPrice?.toString()}
                offeredDuration={selectedProject.offeredDuration ?? undefined}
                showOffer={true}
                className="mb-5"
              />
            )}

            {/* Terms / Contract Scope Preview (If Terms exist) */}
            {selectedProject.terms && (
              <div className="bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 p-4 rounded-2xl mb-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" /> Scope Pekerjaan & Kontrak (Terms)
                  </span>
                  {selectedProject.terms.approvedByClient ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Disetujui Klien
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                      Draft / Menunggu Persetujuan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedProject.terms.scope?.replace(/<[^>]*>?/gm, "").trim()}
                </p>
                <div className="pt-2 border-t border-indigo-200/80 dark:border-indigo-900/50 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Harga Kesepakatan Final:</span>
                  <strong className="text-slate-900 dark:text-white font-black text-sm">
                    Rp {Number(selectedProject.terms.priceFinal).toLocaleString("id-ID")}
                  </strong>
                </div>
              </div>
            )}

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">{t("deadline") || "Tenggat"}</span>
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
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Deskripsi / Brief</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedProject.description.replace(/<[^>]*>?/gm, "").trim()}
                </p>
              </div>
            )}

            {selectedProject.briefFileUrl && (
              <a
                href={selectedProject.briefFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 mb-5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer w-fit border border-blue-200 dark:border-blue-900/50"
              >
                <Download className="w-4 h-4" /> Unduh Lampiran Brief (PDF/Dokumen)
              </a>
            )}

            {/* Form Penawaran Worker */}
            {selectedProject.status === "WORKER_REVIEW" && (
              <div className="mb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedProject.offeredPrice ? "Perbarui Penawaran Harga & Waktu" : "Isi Penawaran Harga & Waktu"}
                  </h4>
                </div>

                <form onSubmit={handleQuoteSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Harga Penawaran (Rp)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">Rp</span>
                        <input
                          required
                          name="offeredPrice"
                          type="number"
                          min="0"
                          step="1000"
                          defaultValue={selectedProject.offeredPrice ? Number(selectedProject.offeredPrice) : ""}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          placeholder="5000000"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Durasi (Hari)</label>
                      <input
                        required
                        name="offeredDuration"
                        type="number"
                        min="1"
                        defaultValue={selectedProject.offeredDuration || ""}
                        className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        placeholder="7"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isSubmittingOffer}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/25 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingOffer ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{selectedProject.offeredPrice ? "Simpan Perubahan" : "Kirim Penawaran"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={selectedProject.status === "CANCELLED"}
                onClick={() => selectedProject.status !== "CANCELLED" && setChatProject(selectedProject)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  selectedProject.status === "CANCELLED"
                    ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> {t("btnChat") || "Pesan"}
              </button>

              <button
                onClick={() => {
                  setSelectedProject(null);
                  setShowOfferForm(false);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Real-time Project Chat Drawer */}
      {chatProject && (
        <ProjectChatDrawer
          isOpen={!!chatProject}
          onClose={() => setChatProject(null)}
          projectId={chatProject.fullId}
          projectTitle={chatProject.name}
          currentUserId={currentUserId || ""}
          userRole="TEAM_MEMBER"
          isCancelled={chatProject.status === "CANCELLED"}
        />
      )}
    </>
  );
}

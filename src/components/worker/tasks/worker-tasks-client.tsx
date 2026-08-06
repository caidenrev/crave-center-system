"use client";

import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createWorkerTask, updateWorkerTaskStatus } from "@/app/actions/worker";

import { TaskItem, TaskItemCard } from "./task-item-card";
import { TaskDetailModal } from "./task-detail-modal";
import { CreateTaskModal } from "./create-task-modal";

export function WorkerTasksClient({ 
  tasks,
  activeProjects = []
}: { 
  tasks: TaskItem[];
  activeProjects?: { id: string; title: string }[];
}) {
  const t = useTranslations("WorkerDashboard");
  const router = useRouter();

  const [prevTasks, setPrevTasks] = useState<TaskItem[]>(tasks);
  const [tasksList, setTasksList] = useState<TaskItem[]>(tasks);

  // Sync tasks prop updates from server during render
  if (prevTasks !== tasks) {
    setPrevTasks(tasks);
    setTasksList(tasks);
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  
  // Status updating loading state
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  // Create Task Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTasks = tasksList.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleUpdateStatus(taskId: string, newStatus: string) {
    if (updatingTaskId) return;
    setUpdatingTaskId(taskId);

    const res = await updateWorkerTaskStatus(taskId, newStatus);
    setUpdatingTaskId(null);

    if (res.success) {
      setTasksList((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      if (selectedTask?.id === taskId) {
        setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      router.refresh();
    } else {
      alert("Error updating status: " + res.error);
    }
  }

  function handleToggleQuickStatus(e: React.MouseEvent, task: TaskItem) {
    e.stopPropagation();
    let nextStatus = "IN_PROGRESS";
    if (task.status === "TO_DO") nextStatus = "IN_PROGRESS";
    else if (task.status === "IN_PROGRESS") nextStatus = "REVIEW";
    else if (task.status === "REVIEW") nextStatus = "DONE";
    else nextStatus = "TO_DO";

    handleUpdateStatus(task.id, nextStatus);
  }

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
      {/* Toolbar Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks or project name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
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
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl shadow-md shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Tambah Tugas
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
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
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === f.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List / Progress Flow Timeline */}
      <div className="pt-2">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">No tasks found.</p>
          </div>
        ) : (
          filteredTasks.map((task, idx) => (
            <TaskItemCard
              key={task.id}
              task={task}
              index={idx}
              totalCount={filteredTasks.length}
              updatingTaskId={updatingTaskId}
              onSelectTask={setSelectedTask}
              onUpdateStatus={handleUpdateStatus}
              onToggleQuickStatus={handleToggleQuickStatus}
            />
          ))
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          updatingTaskId={updatingTaskId}
          onClose={() => setSelectedTask(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          activeProjects={activeProjects}
          isSubmitting={isSubmitting}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Settings,
  LogOut,
  ShieldAlert,
  FolderKanban,
  Search,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import { cn, getDefaultAvatar } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { X } from "lucide-react";

export function AdminSidebar({
  locale,
  user,
  mobileOpen = false,
  onMobileClose,
}: {
  locale: string;
  user?: { name?: string | null; email?: string | null; image?: string | null } | null;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("AdminSidebar");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    {
      title: "",
      items: [
        { name: t("overview"), href: `/${locale}/admin`, icon: LayoutDashboard },
        { name: t("requests"), href: `/${locale}/admin/requests`, icon: CheckSquare },
        { name: t("projects"), href: `/${locale}/admin/projects`, icon: FolderKanban },
        { name: t("team"), href: `/${locale}/admin/team`, icon: Users },
      ],
    },
    {
      title: "Shared",
      items: [
        { name: t("applications"), href: `/${locale}/admin/applications`, icon: ShieldAlert },
      ],
    },
  ];

  const bottomItems = [
    { name: t("settings"), href: `/${locale}/admin/settings`, icon: Settings },
    { name: t("logout"), href: `/${locale}/auth/logout`, icon: LogOut, isLogout: true },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onMobileClose?.();
    router.push(`/${locale}/auth/logout`);
  };

  const renderNavContent = () => (
    <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
      {/* Search Bar */}
      <div className="px-1">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 border border-slate-200 dark:border-slate-800 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="w-4 h-4 shrink-0" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1 px-1">
        {navItems.map((group, idx) => (
          <div key={idx}>
            {group.title && (
              <div className="flex items-center justify-between mb-2 px-2">
                <h4 className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  {group.title}
                </h4>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => onMobileClose?.()}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200",
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white"
                        : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/30 dark:hover:text-white",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4",
                        isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500",
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Profile Info & Dropdown */}
      <div className="px-1 mb-2 mt-auto relative">
        {isProfileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1 right-1 mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-xl p-1.5 z-50 flex flex-col gap-0.5"
            >
              {bottomItems.map((item) => {
                if (item.isLogout) {
                  return (
                    <button
                      key={item.name}
                      suppressHydrationWarning
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                    >
                      <item.icon className="w-4 h-4 text-red-500 dark:text-red-400" />
                      {item.name}
                    </button>
                  );
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      setIsProfileOpen(false);
                      onMobileClose?.();
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      pathname === item.href
                        ? "bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white"
                        : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white",
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", pathname === item.href ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500")} />
                    {item.name}
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
        <div 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center justify-between p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={user?.image || getDefaultAvatar(user?.name || user?.email || "Admin")} 
              alt="Avatar" 
              className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-700" 
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-tight">{user?.name || "Admin"}</span>
              <span className="text-[10px] text-slate-500 truncate">{user?.email || "admin@crave.com"}</span>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0 transition-opacity" />
        </div>
      </div>
    </div>
  );

  const TopBrandHeader = () => (
    <div className="h-16 flex items-center justify-between px-4 mt-2">
      <Link href={`/${locale}/admin`} className="flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
          <img src="/light-mode-logo.png" alt="Crave" className="h-5 w-auto brightness-0 invert" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">Crave ITSM</span>
          <span className="text-xs text-slate-500 font-medium">Admin Workspace</span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 shrink-0 hidden md:flex flex-col z-20">
        <TopBrandHeader />
        {renderNavContent()}
      </aside>

      {/* Mobile / Tablet Slide-Over Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={onMobileClose}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="relative flex flex-col w-72 max-w-[80vw] bg-white dark:bg-[#0B0F19] shadow-2xl h-full border-r border-slate-200 dark:border-slate-800 z-10"
            >
              <TopBrandHeader />
              <button
                onClick={onMobileClose}
                className="absolute right-4 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 z-50 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
              {renderNavContent()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title={t("logoutTitle")}
        description={t("logoutDesc")}
        confirmText={t("logoutConfirm")}
        cancelText={t("logoutCancel")}
        variant="destructive"
      />
    </>
  );
}

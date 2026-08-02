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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";

import { X } from "lucide-react";

export function AdminSidebar({
  locale,
  mobileOpen = false,
  onMobileClose,
}: {
  locale: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("AdminSidebar");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    {
      title: t("panel"),
      items: [
        { name: t("overview"), href: `/${locale}/admin`, icon: LayoutDashboard },
        {
          name: t("requests"),
          href: `/${locale}/admin/requests`,
          icon: CheckSquare,
        },
        {
          name: t("projects"),
          href: `/${locale}/admin/projects`,
          icon: FolderKanban,
        },
        { name: t("team"), href: `/${locale}/admin/team`, icon: Users },
        {
          name: t("applications"),
          href: `/${locale}/admin/applications`,
          icon: ShieldAlert,
        },
      ],
    },
    {
      title: t("general"),
      items: [
        { name: t("settings"), href: `/${locale}/admin/settings`, icon: Settings },
        {
          name: t("logout"),
          href: `/${locale}/auth/logout`,
          icon: LogOut,
          isLogout: true,
        },
      ],
    },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onMobileClose?.();
    router.push(`/${locale}/auth/logout`);
  };

  const renderNavContent = () => (
    <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
      {navItems.map((group) => (
        <div key={group.title}>
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider mb-3 px-3 uppercase">
            {group.title}
          </h4>
          <div className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              if (item.isLogout) {
                return (
                  <button
                    key={item.name}
                    onClick={() => setShowLogoutModal(true)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left cursor-pointer",
                      "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300",
                    )}
                  >
                    <item.icon className="w-5 h-5 text-red-500 dark:text-red-400" />
                    {item.name}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onMobileClose?.()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-primary"
                        : "text-slate-400 dark:text-slate-500",
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
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 hidden md:flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href={`/${locale}/admin`} className="flex items-center group">
            <img
              src="/light-mode-logo.png"
              alt="Crave"
              className="h-7 w-auto dark:hidden transition-transform group-hover:scale-105"
            />
            <img
              src="/dark-mode-logo.png"
              alt="Crave"
              className="h-7 w-auto hidden dark:block transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-xl ml-2 text-slate-900 dark:text-white">
              Admin
            </span>
          </Link>
        </div>
        {renderNavContent()}
      </aside>

      {/* Mobile / Tablet Slide-Over Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={onMobileClose}
            />

            {/* Drawer Content */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="relative flex flex-col w-72 max-w-[80vw] bg-white dark:bg-slate-900 shadow-2xl h-full border-r border-slate-200 dark:border-slate-800 z-10"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
              <Link
                href={`/${locale}/admin`}
                onClick={onMobileClose}
                className="flex items-center group"
              >
                <img
                  src="/light-mode-logo.png"
                  alt="Crave"
                  className="h-7 w-auto dark:hidden"
                />
                <img
                  src="/dark-mode-logo.png"
                  alt="Crave"
                  className="h-7 w-auto hidden dark:block"
                />
                <span className="font-bold text-xl ml-2 text-slate-900 dark:text-white">
                  Admin
                </span>
              </Link>
              <button
                onClick={onMobileClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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

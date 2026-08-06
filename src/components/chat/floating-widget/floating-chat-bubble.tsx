"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getFloatingChatContacts,
  getUserActiveProjectsForChat,
} from "@/app/actions/chat";
import { createClient } from "@/utils/supabase/client";
import { FloatingWidgetHeader } from "./floating-widget-header";
import { FloatingDirectChat, ContactItem } from "./floating-direct-chat";
import { FloatingProjectChat, ProjectChatItem } from "./floating-project-chat";

interface FloatingChatBubbleProps {
  currentUserId?: string;
  userRole?: "CLIENT" | "ADMIN" | "TEAM_MEMBER";
}

export function FloatingChatBubble({
  currentUserId = "",
  userRole = "ADMIN",
}: FloatingChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"DIRECT" | "PROJECTS">("DIRECT");

  // Direct Chat State
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(
    null,
  );
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // Projects Chat State
  const [projects, setProjects] = useState<ProjectChatItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectChatItem | null>(null);

  const [resolvedUserId, setResolvedUserId] = useState(currentUserId);
  const [resolvedRole, setResolvedRole] = useState(userRole);

  const refreshContactsData = useCallback(async () => {
    const contactsRes = await getFloatingChatContacts();
    if (contactsRes.success && contactsRes.contacts) {
      setContacts(contactsRes.contacts);
      setTotalUnreadCount(contactsRes.totalUnreadCount || 0);
      if (contactsRes.currentUserId)
        setResolvedUserId(contactsRes.currentUserId);
      if (contactsRes.userRole) setResolvedRole(contactsRes.userRole as any);
    }
  }, []);

  // Background unread badge initial load & real-time updates
  useEffect(() => {
    let isMounted = true;

    const fetchInitialBadgeData = async () => {
      await refreshContactsData();
    };
    fetchInitialBadgeData();

    const supabase = createClient();
    const channel = supabase
      .channel("floating-bubble-global-unread")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
        },
        () => {
          if (isMounted) {
            refreshContactsData();
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [refreshContactsData]);

  // Load Contacts and Projects when widget opens
  useEffect(() => {
    if (!isOpen) return;

    async function loadData() {
      setIsLoadingContacts(true);
      setIsLoadingProjects(true);

      const [contactsRes, projectsRes] = await Promise.all([
        getFloatingChatContacts(),
        getUserActiveProjectsForChat(),
      ]);

      if (contactsRes.success && contactsRes.contacts) {
        setContacts(contactsRes.contacts);
        setTotalUnreadCount(contactsRes.totalUnreadCount || 0);
        if (contactsRes.currentUserId)
          setResolvedUserId(contactsRes.currentUserId);
        if (contactsRes.userRole) setResolvedRole(contactsRes.userRole as any);
      }

      if (projectsRes.success && projectsRes.projects) {
        setProjects(projectsRes.projects);
        if (projectsRes.currentUserId)
          setResolvedUserId(projectsRes.currentUserId);
        if (projectsRes.userRole) setResolvedRole(projectsRes.userRole as any);
      }

      setIsLoadingContacts(false);
      setIsLoadingProjects(false);
    }

    loadData();
  }, [isOpen]);

  // Listen for custom trigger events from anywhere in app (e.g. "Kirim Pesan Worker")
  useEffect(() => {
    const handleOpenChat = (event: Event) => {
      const customEvent = event as CustomEvent<{
        workerName?: string;
        workerId?: string;
      }>;
      if (customEvent.detail?.workerName && customEvent.detail?.workerId) {
        setActiveTab("DIRECT");
        setSelectedContact({
          id: customEvent.detail.workerId,
          name: customEvent.detail.workerName,
          role: "Team Member",
        });
      }
      setIsOpen(true);
    };

    window.addEventListener("open-floating-chat", handleOpenChat);
    return () =>
      window.removeEventListener("open-floating-chat", handleOpenChat);
  }, []);

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center border-2 border-white/20 cursor-pointer focus:outline-none ring-4 ring-primary/20"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}

          {/* Unread Counter Red Badge */}
          {!isOpen && totalUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1.5 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Floating Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px]"
          >
            {/* Modular Header */}
            <FloatingWidgetHeader
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setSelectedContact(null);
                setSelectedProject(null);
              }}
              onClose={() => setIsOpen(false)}
              showTabs={!selectedContact && !selectedProject}
            />

            {/* Tab 1: Direct Chat */}
            {activeTab === "DIRECT" && (
              <FloatingDirectChat
                contacts={contacts}
                isLoadingContacts={isLoadingContacts}
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
                currentUserId={resolvedUserId}
                onRefreshContacts={refreshContactsData}
              />
            )}

            {/* Tab 2: Project Chat */}
            {activeTab === "PROJECTS" && (
              <FloatingProjectChat
                projects={projects}
                isLoadingProjects={isLoadingProjects}
                selectedProject={selectedProject}
                onSelectProject={setSelectedProject}
                currentUserId={resolvedUserId}
                userRole={resolvedRole}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

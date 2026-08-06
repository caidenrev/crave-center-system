"use client";

import { useState } from "react";
import { WorkerSidebar } from "./worker-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { FloatingChatBubble } from "@/components/chat/floating-widget/floating-chat-bubble";

type UserProps = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function WorkerLayoutShell({
  children,
  locale,
  topbarUser,
}: {
  children: React.ReactNode;
  locale: string;
  topbarUser: UserProps | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      <WorkerSidebar
        locale={locale}
        user={topbarUser}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar
          user={topbarUser}
          onMenuToggle={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
      <FloatingChatBubble currentUserId={topbarUser?.id} userRole="TEAM_MEMBER" />
    </div>
  );
}

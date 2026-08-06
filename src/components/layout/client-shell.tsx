"use client"

import { useState } from "react"
import { ClientSidebar } from "./client-sidebar"
import { ClientTopbar } from "./client-topbar"
import { FloatingChatBubble } from "@/components/chat/floating-widget/floating-chat-bubble"

export function ClientShell({ 
  locale, 
  user, 
  children 
}: { 
  locale: string; 
  user: any; 
  children: React.ReactNode 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      <ClientSidebar 
        locale={locale} 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <ClientTopbar 
          user={user} 
          onMenuToggle={() => setIsSidebarOpen(true)} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative">
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <div className="mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      <FloatingChatBubble currentUserId={user?.id} userRole="CLIENT" />
    </div>
  )
}

import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'
import { User, Bell, Shield, Key } from 'lucide-react'

export default async function AdminSettingsPage() {
  await requireRole(["ADMIN"])
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  }

  const email = user?.email || "admin@crave.com";
  const name = dbUser?.name || user?.user_metadata?.full_name || "Admin User";
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your admin preferences, security, and platform settings.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 border-r border-slate-100 dark:border-slate-800 p-4">
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl text-sm font-medium transition-colors">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-colors">
                <Bell className="w-4 h-4" /> Notifications
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-colors">
                <Shield className="w-4 h-4" /> Platform Rules
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-colors">
                <Key className="w-4 h-4" /> Security
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center text-primary font-bold text-2xl">
                  {initials}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Avatar</h4>
                  <p className="text-xs text-slate-500 mb-3">Recommended size 256x256px</p>
                  <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Change Image
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input type="text" defaultValue={name} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input type="email" defaultValue={email} disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed outline-none transition-all" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium shadow-sm transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

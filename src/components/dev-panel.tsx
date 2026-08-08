'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { changeUserRole } from '@/app/actions/dev'
import { Role } from '@/generated/prisma'

export function DevPanel({ currentUser }: { currentUser: any }) {
  const [loading, setLoading] = useState<Role | null>(null)

  async function handleRoleChange(role: Role) {
    setLoading(role)
    const res = await changeUserRole(role)
    if (res.success) {
      toast.success(`Role successfully changed to ${role}! Please refresh or go to your dashboard.`)
      setTimeout(() => {
        window.location.href = '/' // Force a full reload to reset auth layout states
      }, 1000)
    } else {
      toast.error("Error: " + res.error)
    }
    setLoading(null)
  }

  if (!currentUser) {
    return <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl">You are not logged in! Please login first via the home page.</div>
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-xl mx-auto w-full mt-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Dev Control Panel</h2>
      <p className="text-slate-500 mb-8">Use this panel to test different dashboard views by changing your accounts role.</p>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
        <div className="text-sm text-slate-500 mb-1">Current Account</div>
        <div className="font-semibold text-slate-900">{currentUser.email}</div>
        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Current Role: {currentUser.role}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => handleRoleChange(Role.CLIENT)}
          disabled={loading !== null || currentUser.role === Role.CLIENT}
          className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-xl disabled:opacity-50 hover:bg-slate-800 transition-colors"
        >
          {loading === Role.CLIENT ? "Changing..." : "Become CLIENT"}
        </button>
        <button 
          onClick={() => handleRoleChange(Role.TEAM_MEMBER)}
          disabled={loading !== null || currentUser.role === Role.TEAM_MEMBER}
          className="w-full px-4 py-3 bg-emerald-600 text-white font-medium rounded-xl disabled:opacity-50 hover:bg-emerald-700 transition-colors"
        >
          {loading === Role.TEAM_MEMBER ? "Changing..." : "Become WORKER (TEAM_MEMBER)"}
        </button>
        <button 
          onClick={() => handleRoleChange(Role.ADMIN)}
          disabled={loading !== null || currentUser.role === Role.ADMIN}
          className="w-full px-4 py-3 bg-purple-600 text-white font-medium rounded-xl disabled:opacity-50 hover:bg-purple-700 transition-colors"
        >
          {loading === Role.ADMIN ? "Changing..." : "Become ADMIN"}
        </button>
      </div>
    </div>
  )
}

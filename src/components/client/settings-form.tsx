'use client'

import { useState } from 'react'
import { updateClientSettings } from '@/app/actions/client'

export function SettingsForm({ user, t }: { user: any, t: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const res = await updateClientSettings(formData)

    if (res.success) {
      setMessage({ text: t.success || "Profile updated successfully!", type: 'success' })
    } else {
      setMessage({ text: res.error || t.error || "Failed to update profile.", type: 'error' })
    }
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {message.text}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.name || "Full Name"}</label>
        <input 
          required 
          name="name" 
          type="text" 
          defaultValue={user.name}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.phone || "Phone Number"}</label>
        <input 
          name="phone" 
          type="text" 
          defaultValue={user.phone || ''}
          placeholder="+62 8..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
        />
      </div>

      <div className="pt-4">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl disabled:opacity-50 transition-all hover:bg-primary/90 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              {t.saving || "Saving..."}
            </>
          ) : (
            t.save || "Save Changes"
          )}
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { updateClientSettings } from '@/app/actions/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export function SettingsForm({ user, t }: { user: any, t: any }) {
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('phone', phone)

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
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {message.text}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">{t.name || "Full Name"}</Label>
        <Input 
          required 
          name="name" 
          id="name"
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t.phone || "Phone Number"}</Label>
        <Input 
          name="phone" 
          id="phone"
          type="text" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+62 8..."
          className="h-11 rounded-xl"
        />
      </div>

      <div className="pt-2">
        <Button 
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="px-6 rounded-xl cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.saving || "Saving..."}
            </>
          ) : (
            t.save || "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}

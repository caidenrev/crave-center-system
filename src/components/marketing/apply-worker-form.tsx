'use client'

import { useState } from 'react'
import { submitApplication } from '@/app/actions/application'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function ApplyWorkerForm() {
  const t = useTranslations('Apply')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const result = await submitApplication(formData)
      if (result.error) throw new Error(result.error)
      
      toast.success(t('success'))
      window.location.reload()
    } catch (error) {
      toast.error(t('failed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-slate-900 dark:text-white font-semibold">{t('catLabel')}</Label>
          <select 
            id="category" 
            name="category" 
            required
            className="flex h-11 w-full cursor-pointer rounded-xl border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50"
          >
            <option value="">{t('catPlaceholder')}</option>
            <option value="IT">{t('catIt')}</option>
            <option value="NON_IT">{t('catNonIt')}</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skills" className="text-slate-900 dark:text-white font-semibold">{t('skillsLabel')}</Label>
          <Input 
            id="skills" 
            name="skills" 
            placeholder={t('skillsPlaceholder')}
            required 
            className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason" className="text-slate-900 dark:text-white font-semibold">{t('reasonLabel')} <span className="text-red-500">*</span></Label>
        <Textarea 
          id="reason" 
          name="reason" 
          placeholder={t('reasonPlaceholder')}
          required 
          className="min-h-[100px] rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-slate-900 dark:text-white font-semibold">{t('whatsappLabel')} <span className="text-red-500">*</span></Label>
          <Input 
            id="whatsapp" 
            name="whatsapp" 
            type="tel"
            placeholder={t('whatsappPlaceholder')}
            required 
            className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-900 dark:text-white font-semibold">{t('emailLabel')} <span className="text-red-500">*</span></Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            placeholder={t('emailPlaceholder')}
            required 
            className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioUrl" className="text-slate-900 dark:text-white font-semibold">{t('portfolioLabel')} (Optional)</Label>
        <Input 
          id="portfolioUrl" 
          name="portfolioUrl" 
          type="url" 
          placeholder="https://..."
          className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="githubUrl" className="text-slate-900 dark:text-white font-semibold">{t('githubLabel')} (Optional)</Label>
          <Input 
            id="githubUrl" 
            name="githubUrl" 
            type="url" 
            placeholder="https://github.com/..."
            className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl" className="text-slate-900 dark:text-white font-semibold">{t('linkedinLabel')} (Optional)</Label>
          <Input 
            id="linkedinUrl" 
            name="linkedinUrl" 
            type="url" 
            placeholder="https://linkedin.com/in/..."
            className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instagramUrl" className="text-slate-900 dark:text-white font-semibold">{t('instagramLabel')} (Optional)</Label>
          <Input 
            id="instagramUrl" 
            name="instagramUrl" 
            type="url" 
            placeholder="https://instagram.com/..."
            className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tiktokUrl" className="text-slate-900 dark:text-white font-semibold">{t('tiktokLabel')} (Optional)</Label>
          <Input 
            id="tiktokUrl" 
            name="tiktokUrl" 
            type="url" 
            placeholder="https://tiktok.com/@..."
            className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-12 text-base font-bold rounded-xl mt-4 bg-primary hover:bg-blue-700 text-white transition-all shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submitBtn')
          )}
        </Button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Code2, PenTool, Star, UploadCloud, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createJobRequest } from '@/app/actions/project'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

type Worker = {
  id: string
  name: string
  category: string | null
  skills: string[]
  rating: number
  totalReviews: number
  image?: string | null
}

type Dictionary = {
  [key: string]: string
}

function getDefaultAvatar(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i);
  }
  const avatarIndex = (sum % 7) + 1; // Emojis are 1 to 7
  return `/profile-pict/emoji-${avatarIndex}.jpeg`;
}

export function JobRequestWizard({ workers, t }: { workers: Worker[], t: Dictionary }) {
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<'IT' | 'NON_IT' | null>(null)
  const [workerId, setWorkerId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')

  const filteredWorkers = workers.filter(w => w.category === category)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!category || !workerId) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    formData.append('category', category)
    formData.append('workerId', workerId)

    try {
      // 1. Upload File if exists
      let fileUrl = ''
      if (file) {
        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from('project_briefs')
          .upload(fileName, file)
          
        if (error) {
          console.error("Upload error:", error)
          toast.error("Failed to upload file")
          setIsSubmitting(false)
          return
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('project_briefs')
          .getPublicUrl(data.path)
          
        fileUrl = publicUrlData.publicUrl
      }

      if (fileUrl) {
        formData.append('briefFileUrl', fileUrl)
      }

      // 2. Submit form
      const res = await createJobRequest(formData)
      if (res.success) {
        toast.success(t.success || "Request berhasil dikirim!")
        const locale = window.location.pathname.split('/')[1] || 'id'
        router.push(`/${locale}/client`)
      } else {
        toast.error(res.error || "Gagal mengirim permintaan")
      }
    } catch (err) {
      console.error(err)
      toast.error("Terjadi kesalahan jaringan")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="w-full">
      
      {/* Progress Steps */}
      <div className="flex items-center mb-10">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
        <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>2</div>
        <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>3</div>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{t.step1}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setCategory('IT')}
              className={`flex flex-col items-center justify-center p-8 md:p-10 min-h-[260px] rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.98] group ${category === 'IT' ? 'border-primary shadow-md ring-4 ring-primary/10 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-sm'}`}
            >
              <div className="mb-6">
                <Code2 className={`w-14 h-14 transition-colors ${category === 'IT' ? 'text-primary' : 'text-slate-700 dark:text-slate-300 group-hover:text-primary'}`} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 text-center">{t.it}</h3>
              <p className="text-sm text-slate-500 text-center leading-relaxed max-w-[240px]">{t.itDesc}</p>
            </button>

            <button 
              onClick={() => setCategory('NON_IT')}
              className={`flex flex-col items-center justify-center p-8 md:p-10 min-h-[260px] rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.98] group ${category === 'NON_IT' ? 'border-primary shadow-md ring-4 ring-primary/10 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-sm'}`}
            >
              <div className="mb-6">
                <PenTool className={`w-14 h-14 transition-colors ${category === 'NON_IT' ? 'text-primary' : 'text-slate-700 dark:text-slate-300 group-hover:text-primary'}`} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 text-center">{t.nonIt}</h3>
              <p className="text-sm text-slate-500 text-center leading-relaxed max-w-[240px]">{t.nonItDesc}</p>
            </button>
          </div>
          <div className="mt-8 flex justify-between">
            <Button 
              variant="secondary" 
              onClick={() => router.back()} 
              className="px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              {t.back || 'Kembali'}
            </Button>
            <Button 
              disabled={!category}
              onClick={() => setStep(2)}
              size="lg"
              className="px-6 rounded-xl"
            >
              {t.continue}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t.step2}</h2>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {filteredWorkers.map(w => (
              <div 
                key={w.id} 
                onClick={() => setWorkerId(w.id)} 
                className={`p-4 md:p-5 rounded-3xl cursor-pointer flex items-center justify-between transition-all duration-300 ${workerId === w.id ? 'bg-white dark:bg-slate-900 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.12)] border-2 border-primary/30 dark:border-primary/40' : 'bg-slate-100 dark:bg-slate-800/60 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800'}`}
              >
                <div className="flex items-center gap-5 w-full">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center overflow-hidden">
                    <img 
                      src={w.image || getDefaultAvatar(w.id)} 
                      alt={w.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1 truncate">{w.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      <span className="inline-flex items-center mr-2">
                        <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                        <span className="font-medium text-amber-600 dark:text-amber-500">{w.rating}</span>
                      </span>
                      {w.skills.slice(0, 3).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filteredWorkers.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                {t.noWorkers || 'No workers found for this category.'}
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-between">
            <Button 
              variant="secondary" 
              onClick={() => setStep(1)} 
              className="px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              {t.back}
            </Button>
            <Button 
              disabled={!workerId}
              onClick={() => setStep(3)}
              size="lg"
              className="px-6 rounded-xl"
            >
              {t.continue}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t.step3}</h2>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">{t.projectTitle}</Label>
              <Input required name="title" id="title" type="text" className="h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" placeholder="E.g. E-Commerce Website" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t.projectDesc}</Label>
              <input type="hidden" name="description" value={description} />
              <RichTextEditor value={description} onChange={setDescription} placeholder="Describe what you need..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="targetDeliveryDate">{t.deadline}</Label>
                <Input required name="targetDeliveryDate" id="targetDeliveryDate" type="date" className="h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetRange">{t.budgetLabel || 'Budget (Optional)'}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                  <Input name="budgetRange" id="budgetRange" type="number" min="0" step="1000" className="h-11 pl-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" placeholder="e.g. 5000000" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.uploadBrief}</Label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {file ? file.name : (t.dropzone || 'Drag and drop your file here, or click to browse')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setStep(2)} 
              className="px-6 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              {t.back}
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="px-6 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.submit
              )}
            </Button>
          </div>
        </form>
      )}

    </div>
  )
}

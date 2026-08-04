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

type Worker = {
  id: string
  name: string
  category: string | null
  skills: string[]
  rating: number
  totalReviews: number
}

type Dictionary = {
  [key: string]: string
}

export function JobRequestWizard({ workers, t }: { workers: Worker[], t: Dictionary }) {
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<'IT' | 'NON_IT' | null>(null)
  const [workerId, setWorkerId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)

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
        router.push('/client')
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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
      
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
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t.step1}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setCategory('IT')}
              className={`p-6 rounded-2xl border-2 text-left transition-all cursor-pointer active:scale-[0.98] ${category === 'IT' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-sm'}`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.it}</h3>
              <p className="text-sm text-slate-500">{t.itDesc}</p>
            </button>

            <button 
              onClick={() => setCategory('NON_IT')}
              className={`p-6 rounded-2xl border-2 text-left transition-all cursor-pointer active:scale-[0.98] ${category === 'NON_IT' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-sm'}`}
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.nonIt}</h3>
              <p className="text-sm text-slate-500">{t.nonItDesc}</p>
            </button>
          </div>
          <div className="mt-8 flex justify-end">
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
              <div key={w.id} onClick={() => setWorkerId(w.id)} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all active:scale-[0.99] ${workerId === w.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-sm'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                    {w.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{w.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-amber-500 text-sm font-medium">
                        <Star className="w-4 h-4 fill-amber-500 mr-1" />
                        {w.rating} ({w.totalReviews})
                      </div>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <div className="flex gap-1">
                        {w.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${workerId === w.id ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                  {workerId === w.id && <CheckCircle2 className="w-4 h-4 text-white" />}
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
            <Button variant="ghost" onClick={() => setStep(1)} className="px-6 rounded-xl">
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
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t.projectTitle}</Label>
              <Input required name="title" id="title" type="text" className="h-11 rounded-xl" placeholder="E.g. E-Commerce Website" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t.projectDesc}</Label>
              <Textarea required name="description" id="description" rows={4} className="min-h-[100px] rounded-xl" placeholder="Describe what you need..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetDeliveryDate">{t.deadline}</Label>
                <Input required name="targetDeliveryDate" id="targetDeliveryDate" type="date" className="h-11 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetRange">{t.budgetLabel || 'Budget (Optional)'}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                  <Input name="budgetRange" id="budgetRange" type="number" min="0" step="1000" className="h-11 pl-10 rounded-xl" placeholder="e.g. 5000000" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.uploadBrief}</Label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer">
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
            <Button type="button" variant="ghost" onClick={() => setStep(2)} className="px-6 rounded-xl">
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

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Code2, PenTool, Star, UploadCloud, CheckCircle2 } from 'lucide-react'
import { createJobRequest } from '@/app/actions/project'
import { createClient } from '@/utils/supabase/client'

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
          alert("Failed to upload file")
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
        alert(t.success)
        router.push('/client')
      } else {
        alert(res.error)
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
      
      {/* Progress Steps */}
      <div className="flex items-center mb-10">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
        <div className={`flex-1 h-1 mx-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>2</div>
        <div className={`flex-1 h-1 mx-2 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>3</div>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t.step1}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setCategory('IT')}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${category === 'IT' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.it}</h3>
              <p className="text-sm text-slate-500">{t.itDesc}</p>
            </button>

            <button 
              onClick={() => setCategory('NON_IT')}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${category === 'NON_IT' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.nonIt}</h3>
              <p className="text-sm text-slate-500">{t.nonItDesc}</p>
            </button>
          </div>
          <div className="mt-8 flex justify-end">
            <button 
              disabled={!category}
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl disabled:opacity-50 transition-all hover:bg-primary/90"
            >
              {t.continue}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t.step2}</h2>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {filteredWorkers.map(w => (
              <div key={w.id} onClick={() => setWorkerId(w.id)} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${workerId === w.id ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}>
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
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${workerId === w.id ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                  {workerId === w.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </div>
            ))}
            {filteredWorkers.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                No workers found for this category.
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="px-6 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-all">
              {t.back}
            </button>
            <button 
              disabled={!workerId}
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl disabled:opacity-50 transition-all hover:bg-primary/90"
            >
              {t.continue}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t.step3}</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.projectTitle}</label>
              <input required name="title" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="E.g. E-Commerce Website" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.projectDesc}</label>
              <textarea required name="description" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Describe what you need..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.deadline}</label>
              <input required name="targetDeliveryDate" type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Budget (Opsional)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400">Rp</span>
                <input name="budgetRange" type="number" min="0" step="1000" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. 5000000" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.uploadBrief}</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {file ? file.name : "Drag and drop your file here, or click to browse"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="px-6 py-2.5 text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-all">
              {t.back}
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl disabled:opacity-50 transition-all hover:bg-primary/90 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  {t.submitting}
                </>
              ) : (
                t.submit
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  )
}

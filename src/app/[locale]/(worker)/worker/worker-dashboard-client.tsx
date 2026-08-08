'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, User, Loader2 } from 'lucide-react'
import { submitWorkerOffer } from '@/app/actions/worker'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function WorkerDashboardClient({ requests, t }: { requests: any[], t: any }) {
  const [selectedReq, setSelectedReq] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleQuoteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedReq) return
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    formData.append("projectId", selectedReq.id)
    
    const res = await submitWorkerOffer(formData)
    setIsSubmitting(false)
    
    if (res.success) {
      toast.success("Quote submitted successfully!")
      setSelectedReq(null)
      router.refresh()
    } else {
      toast.error("Error: " + res.error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Request List */}
      <div className="lg:col-span-1 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t.newRequests}</h2>
        {requests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center shadow-sm border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">{t.noRequests}</p>
          </div>
        ) : (
          requests.map(req => (
            <div 
              key={req.id} 
              onClick={() => setSelectedReq(req)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.99] ${selectedReq?.id === req.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 hover:shadow-sm'}`}
            >
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{req.title}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <User className="w-4 h-4" /> {req.client.name}
              </div>
              {req.targetDeliveryDate && (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 font-medium">
                  <Calendar className="w-4 h-4" /> 
                  {new Date(req.targetDeliveryDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Right Column: Detail & Response Form */}
      <div className="lg:col-span-2">
        {selectedReq ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.projectDetails}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">{t.client}</p>
                <p className="font-medium text-slate-900 dark:text-white">{selectedReq.client.name}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">{t.deadline}</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {selectedReq.targetDeliveryDate ? new Date(selectedReq.targetDeliveryDate).toLocaleDateString() : 'Flexible'}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Description</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedReq.description}
              </p>
            </div>

            {selectedReq.briefFileUrl && (
              <div className="mb-8">
                <a 
                  href={selectedReq.briefFileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  {t.downloadBrief}
                </a>
              </div>
            )}

            <hr className="border-slate-200 dark:border-slate-800 mb-8" />

            {/* Quote Form */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.quoteTitle}</h3>
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="offeredPrice">{t.price}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                      <Input required name="offeredPrice" id="offeredPrice" type="number" min="0" step="1000" className="h-11 pl-10 rounded-xl" placeholder="5000000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offeredDuration">{t.duration}</Label>
                    <Input required name="offeredDuration" id="offeredDuration" type="number" min="1" className="h-11 rounded-xl" placeholder="e.g. 7" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="px-6 rounded-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      t.submitQuote
                    )}
                  </Button>
                </div>
              </form>
            </div>

          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl h-full min-h-[400px] flex items-center justify-center">
            <div className="text-center text-slate-400 dark:text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a request from the left to view details</p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, User } from 'lucide-react'
import { submitWorkerOffer } from '@/app/actions/worker'
import { useRouter } from 'next/navigation'

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
      alert("Quote submitted successfully!")
      setSelectedReq(null)
      router.refresh()
    } else {
      alert("Error: " + res.error)
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
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedReq?.id === req.id ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50'}`}
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
            
            <div className="grid grid-cols-2 gap-4 mb-6">
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
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.price}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-slate-400">Rp</span>
                      <input required name="offeredPrice" type="number" min="0" step="1000" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="5000000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.duration}</label>
                    <input required name="offeredDuration" type="number" min="1" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. 7" />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-primary text-white font-medium rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? "Submitting..." : t.submitQuote}
                  </button>
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

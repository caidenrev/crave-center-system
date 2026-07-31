'use client'

import { useState } from 'react'
import { reviewApplication } from '@/app/actions/application'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ReviewButtons({ applicationId }: { applicationId: string }) {
  const [loadingAction, setLoadingAction] = useState<'APPROVE' | 'REJECT' | null>(null)
  const router = useRouter()

  const handleReview = async (action: 'APPROVE' | 'REJECT') => {
    setLoadingAction(action)
    const res = await reviewApplication(applicationId, action)
    
    if (res.success) {
      toast.success(`Application ${action === 'APPROVE' ? 'Approved' : 'Rejected'}!`)
      router.refresh()
    } else {
      toast.error(res.error || "Something went wrong")
    }
    setLoadingAction(null)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20"
        onClick={() => handleReview('REJECT')}
        disabled={loadingAction !== null}
      >
        {loadingAction === 'REJECT' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}
        Reject
      </Button>
      <Button 
        size="sm" 
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => handleReview('APPROVE')}
        disabled={loadingAction !== null}
      >
        {loadingAction === 'APPROVE' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
        Approve
      </Button>
    </div>
  )
}

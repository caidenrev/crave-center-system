import { prisma } from '@/lib/db'
import { createClient } from "@/utils/supabase/server"
import { DevPanel } from '@/components/dev-panel'
import Link from 'next/link'

export default async function DevPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const dbUser = user?.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 absolute top-6 left-6 font-medium">
          ← Back to Home
        </Link>
        <DevPanel currentUser={dbUser} />
      </div>
    </div>
  )
}

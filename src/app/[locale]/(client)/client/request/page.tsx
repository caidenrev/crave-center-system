"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createJobRequest } from "@/app/actions/project"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export default function JobRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(event.currentTarget)
    const result = await createJobRequest(formData)
    
    if (result.success) {
      toast.success("Job request berhasil dikirim!")
      router.push("/client-dashboard") // bisa diarahkan ke halaman daftar pesanan
    } else {
      toast.error(result.error || "Gagal mengirim request")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Buat Job Request Baru</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Ceritakan ide atau kebutuhan IT Anda. Tim kami akan segera meninjaunya.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Project <span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="Misal: Pembuatan Website E-Commerce" 
              required 
              className="h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Detail <span className="text-red-500">*</span></Label>
            <input type="hidden" name="description" value={description} required />
            <RichTextEditor value={description} onChange={setDescription} placeholder="Jelaskan secara detail fitur dan kebutuhan bisnis Anda..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetRange">Estimasi Budget</Label>
            <Select name="budgetRange">
              <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm">
                <SelectValue placeholder="Pilih range budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="< 10 Juta">&lt; 10 Juta</SelectItem>
                <SelectItem value="10 Juta - 50 Juta">10 Juta - 50 Juta</SelectItem>
                <SelectItem value="50 Juta - 100 Juta">50 Juta - 100 Juta</SelectItem>
                <SelectItem value="> 100 Juta">&gt; 100 Juta</SelectItem>
                <SelectItem value="Belum Tahu">Belum Tahu / Butuh Konsultasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Job Request"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

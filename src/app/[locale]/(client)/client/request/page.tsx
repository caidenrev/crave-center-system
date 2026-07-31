"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createJobRequest } from "@/app/actions/project"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function JobRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    <div className="max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl dark:bg-zinc-900/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Buat Job Request Baru</CardTitle>
            <CardDescription>
              Ceritakan ide atau kebutuhan IT Anda. Tim kami akan segera meninjaunya.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Project <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Misal: Pembuatan Website E-Commerce" 
                  required 
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Detail <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Jelaskan secara detail fitur dan kebutuhan bisnis Anda..." 
                  required 
                  className="min-h-[150px] resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetRange">Estimasi Budget</Label>
                <Select name="budgetRange">
                  <SelectTrigger className="h-11">
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

              <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

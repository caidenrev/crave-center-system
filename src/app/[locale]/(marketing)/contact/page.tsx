"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

export default function ContactPage() {
  const t = useTranslations("ContactPage")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success(t("success"))
    setIsSubmitting(false)
  }

  return (
    <div className="relative overflow-hidden flex flex-col items-center pt-32 pb-24 min-h-screen">
      <div className="w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">{t("infoTitle")}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">{t("email")}</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">hello@crave-itsm.com</p>
                    <p className="text-sm text-zinc-500 mt-1">{t("emailDesc")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">{t("hq")}</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">Jl. Inovasi Teknologi No. 88<br />Jakarta Selatan, Indonesia 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">{t("phone")}</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">+62 811 2233 4455</p>
                    <p className="text-sm text-zinc-500 mt-1">{t("phoneDesc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">{t("formTitle")}</h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input id="firstName" placeholder="Eka" className="h-12 rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input id="lastName" placeholder="Revandi" className="h-12 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("emailLabel")}</Label>
                  <Input id="email" type="email" placeholder="Eka@perusahaan.com" className="h-12 rounded-xl" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("messageLabel")}</Label>
                  <Textarea id="message" placeholder={t("messagePlaceholder")} className="min-h-[150px] resize-y rounded-xl" required />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    t("submit")
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

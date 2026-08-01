"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerWithEmail } from "@/app/actions/auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/ui/password-input"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function RegisterPage() {
  const t = useTranslations("RegisterPage")
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEmailLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const result = await registerWithEmail(formData)
      if (result?.error) {
        toast.error(result.error)
        setIsEmailLoading(false)
      } else if (result?.success) {
        toast.success("Registration successful! Please check your email to verify.")
        setIsEmailLoading(false)
      }
    } catch {
      toast.error("An unexpected error occurred")
      setIsEmailLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="border-0 ring-0 shadow-none bg-transparent md:ring-1 md:shadow-2xl md:bg-white/80 md:backdrop-blur-xl md:dark:bg-zinc-900/80">
        <CardHeader className="space-y-1 md:space-y-2 text-center p-4 pb-2 md:p-6 md:pb-6">
          <motion.img
            src="/light-mode-logo.png"
            alt="Crave"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="h-8 md:h-10 w-auto mx-auto mb-2 md:mb-4 dark:hidden"
          />
          <motion.img
            src="/dark-mode-logo.png"
            alt="Crave"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="h-8 md:h-10 w-auto mx-auto mb-2 md:mb-4 hidden dark:block"
          />
          <CardTitle className="text-2xl font-bold tracking-tight">{t("title")}</CardTitle>
          <CardDescription className="text-zinc-500">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4 p-4 pt-0 md:p-6 md:pt-0">
          <GoogleAuthButton
            label={t("googleBtn")}
            loadingLabel={t("googleLoading")}
            disabled={isEmailLoading}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">
                {t("orEmail")}
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailRegister} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="name" className="text-xs md:text-sm">{t("nameLabel")}</Label>
              <Input id="name" name="name" type="text" placeholder={t("namePlaceholder")} className="h-9 md:h-11 text-xs md:text-sm px-2" required disabled={isEmailLoading} />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="email" className="text-xs md:text-sm">{t("emailLabel")}</Label>
              <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} className="h-9 md:h-11 text-xs md:text-sm px-2" required disabled={isEmailLoading} />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="phone" className="text-xs md:text-sm">{t("phoneLabel")}</Label>
              <Input id="phone" name="phone" type="tel" placeholder={t("phonePlaceholder")} className="h-9 md:h-11 text-xs md:text-sm px-2" required disabled={isEmailLoading} />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="password" className="text-xs md:text-sm">{t("passwordLabel")}</Label>
              <PasswordInput id="password" name="password" placeholder={t("passwordPlaceholder")} className="h-9 md:h-11 text-xs md:text-sm px-2" required disabled={isEmailLoading} />
            </div>
            <div className="col-span-1 md:col-span-2 pt-2">
              <Button type="submit" className="w-full h-9 md:h-11 text-xs md:text-sm cursor-pointer" disabled={isEmailLoading}>
                {isEmailLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("registering")}
                  </>
                ) : (
                  t("registerBtn")
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 md:gap-4 text-center p-4 pt-0 md:p-6 md:pt-0">
          <div className="text-sm text-zinc-500">
            {t("hasAccount")}{" "}
            <Link href="/login" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
              {t("signIn")}
            </Link>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm">
            {t("terms")}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

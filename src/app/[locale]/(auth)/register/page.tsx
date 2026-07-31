"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginWithGoogle, registerWithEmail } from "@/app/actions/auth"
import { toast } from "sonner"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function RegisterPage() {
  const t = useTranslations("RegisterPage")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    try {
      const result = await loginWithGoogle()
      if (result?.error) {
        toast.error(result.error)
        setIsLoading(false)
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (error) {
      toast.error(t("googleError") || "Error")
      setIsLoading(false)
    }
  }

  const handleEmailRegister = async (formData: FormData) => {
    setIsEmailLoading(true)
    const result = await registerWithEmail(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setIsEmailLoading(false)
    } else if (result?.success) {
      toast.success("Registration successful! Please check your email to verify.")
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
          <Button 
            variant="outline" 
            className="w-full h-10 md:h-11 relative overflow-hidden group border-zinc-200 dark:border-zinc-800" 
            onClick={handleGoogleRegister}
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t("googleBtn")}
            </span>
          </Button>

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

          <form action={handleEmailRegister} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="name" className="text-xs md:text-sm">{t("nameLabel")}</Label>
              <Input id="name" name="name" type="text" placeholder={t("namePlaceholder")} className="h-9 md:h-11 text-xs md:text-sm px-2" required disabled={isEmailLoading || isLoading} />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="email" className="text-xs md:text-sm">{t("emailLabel")}</Label>
              <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} className="h-9 md:h-11 text-xs md:text-sm px-2" required disabled={isEmailLoading || isLoading} />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="phone" className="text-xs md:text-sm">{t("phoneLabel")}</Label>
              <Input id="phone" name="phone" type="tel" placeholder={t("phonePlaceholder")} className="h-9 md:h-11 text-xs md:text-sm px-2" required disabled={isEmailLoading || isLoading} />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="password" className="text-xs md:text-sm">{t("passwordLabel")}</Label>
              <Input id="password" name="password" type="password" placeholder={t("passwordPlaceholder")} className="h-9 md:h-11 text-xs md:text-sm px-2" required disabled={isEmailLoading || isLoading} />
            </div>
            <div className="col-span-1 md:col-span-2 pt-2">
              <Button type="submit" className="w-full h-9 md:h-11 text-xs md:text-sm" disabled={isEmailLoading || isLoading}>
                {isEmailLoading ? "Loading..." : t("registerBtn")}
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

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginWithEmail } from "@/app/actions/auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/ui/password-input"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const t = useTranslations("LoginPage")
  const locale = useLocale()
  const router = useRouter()
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEmailLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const result = await loginWithEmail(formData)
      if (result?.error) {
        toast.error(result.error)
        setIsEmailLoading(false)
      } else if (result?.success) {
        toast.success(t("title") + " OK")
        router.push("/auth/callback")
      }
    } catch {
      toast.error("An unexpected error occurred")
      setIsEmailLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="border-0 ring-0 shadow-none bg-transparent md:ring-1 md:shadow-2xl md:bg-white/80 md:backdrop-blur-xl md:dark:bg-zinc-900/80">
        <CardHeader className="space-y-2 text-center pb-6">
          <motion.img
            src="/light-mode-logo.png"
            alt="Crave"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="h-10 w-auto mx-auto mb-4 dark:hidden"
          />
          <motion.img
            src="/dark-mode-logo.png"
            alt="Crave"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="h-10 w-auto mx-auto mb-4 hidden dark:block"
          />
          <CardTitle className="text-2xl font-bold tracking-tight">{t("title")}</CardTitle>
          <CardDescription className="text-zinc-500">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleAuthButton
            label={t("googleBtn")}
            loadingLabel={t("googleLoading")}
            errorMessage={t("googleError")}
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

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} className="h-11" required disabled={isEmailLoading} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <Link href="#" className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                  {t("forgotPassword")}
                </Link>
              </div>
              <PasswordInput id="password" name="password" placeholder="••••••••" className="h-11" required disabled={isEmailLoading} />
            </div>
            <Button type="submit" className="w-full h-11 cursor-pointer" disabled={isEmailLoading}>
              {isEmailLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("signingIn")}
                </>
              ) : (
                t("signInBtn")
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <div className="text-sm text-zinc-500">
            {t("noAccount")}{" "}
            <Link href={`/${locale}/register`} className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
              {t("register")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

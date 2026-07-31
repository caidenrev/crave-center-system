"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Info, BookOpen, PhoneCall, Briefcase } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

export function Navbar() {
  const t = useTranslations("Navbar")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false)
  const [isMobileCompanyOpen, setIsMobileCompanyOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
      setIsLoadingAuth(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 inset-x-0 mx-auto z-50 flex justify-center px-4"
    >
      <div className="flex flex-col items-center justify-between w-full max-w-5xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/40 dark:border-zinc-800/60 shadow-[0_12px_48px_rgba(0,0,0,0.15)] rounded-3xl transition-all duration-300">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between w-full px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img src="/light-mode-logo.png" alt="Crave" className="h-8 w-auto dark:hidden transition-transform group-hover:scale-105" />
            <img src="/dark-mode-logo.png" alt="Crave" className="h-8 w-auto hidden dark:block transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
              {t("products")}
            </Link>
            <Link href="/solutions" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
              {t("solutions")}
            </Link>
            <Link href="/services" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
              {t("services")}
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors">
              {t("pricing")}
            </Link>
            
            {/* Desktop Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCompanyDropdownOpen(true)}
              onMouseLeave={() => setIsCompanyDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-primary dark:text-zinc-300 dark:hover:text-primary transition-colors py-2">
                {t("company")} <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isCompanyDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-72" // pt-4 serves as an invisible bridge so hover doesn't break
                  >
                    <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-zinc-200/50 dark:border-zinc-700/50 p-3 flex flex-col gap-1 overflow-hidden">
                      <Link href="/about" className="flex items-start gap-3 p-3 text-left hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-colors group/item">
                        <div className="bg-primary/10 dark:bg-primary/20 text-primary p-2 rounded-lg mt-0.5 group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                          <Info className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5 group-hover/item:text-primary transition-colors">{t("about")}</div>
                          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("aboutDesc")}</div>
                        </div>
                      </Link>

                      <Link href="/careers" className="flex items-start gap-3 p-3 text-left hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-colors group/item">
                        <div className="bg-primary/10 dark:bg-primary/20 text-primary p-2 rounded-lg mt-0.5 group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5 group-hover/item:text-primary transition-colors">{t("careers")}</div>
                          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("careersDesc")}</div>
                        </div>
                      </Link>
                      
                      <Link href="/resources" className="flex items-start gap-3 p-3 text-left hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-colors group/item">
                        <div className="bg-primary/10 dark:bg-primary/20 text-primary p-2 rounded-lg mt-0.5 group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5 group-hover/item:text-primary transition-colors">{t("resources")}</div>
                          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("resourcesDesc")}</div>
                        </div>
                      </Link>
                      
                      <Link href="/contact" className="flex items-start gap-3 p-3 text-left hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-colors group/item">
                        <div className="bg-primary/10 dark:bg-primary/20 text-primary p-2 rounded-lg mt-0.5 group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                          <PhoneCall className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-0.5 group-hover/item:text-primary transition-colors">{t("contact")}</div>
                          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("contactDesc")}</div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* CTA & Theme Toggle (Desktop) / Mobile Toggle */}
          <div className="flex items-center gap-1 md:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-3">
              {!isLoadingAuth && (
                isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="rounded-full h-9 px-5 bg-primary hover:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md font-bold">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors">
                      {t("signIn")}
                    </Link>
                    <Link href="/request">
                      <Button className="rounded-full h-9 px-5 bg-primary hover:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95 shadow-md font-bold">
                        {t("getStarted")}
                      </Button>
                    </Link>
                  </>
                )
              )}
            </div>
            <button 
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full md:hidden border-t border-zinc-200 dark:border-zinc-800 rounded-b-3xl overflow-hidden"
            >
              <nav className="flex flex-col p-6 gap-6 bg-white/50 dark:bg-zinc-900/50">
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-zinc-900 dark:text-white">{t("products")}</Link>
                <Link href="/solutions" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-zinc-900 dark:text-white">{t("solutions")}</Link>
                <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-zinc-900 dark:text-white">{t("services")}</Link>
                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-zinc-900 dark:text-white">{t("pricing")}</Link>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setIsMobileCompanyOpen(!isMobileCompanyOpen)} 
                    className="flex items-center justify-between text-lg font-bold text-zinc-900 dark:text-white w-full text-left"
                  >
                    {t("company")}
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isMobileCompanyOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isMobileCompanyOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4 overflow-hidden pl-4 ml-2 border-l-2 border-zinc-200 dark:border-zinc-800"
                      >
                        <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary">{t("about")}</Link>
                        <Link href="/careers" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary">{t("careers")}</Link>
                        <Link href="/resources" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary">{t("resources")}</Link>
                        <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary">{t("contact")}</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2" />
                
                <div className="flex flex-col gap-3">
                  {!isLoadingAuth && (
                    isAuthenticated ? (
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full h-12 rounded-xl text-base bg-primary hover:bg-blue-700 text-white font-bold">
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full h-12 rounded-xl text-base font-bold border-zinc-300 dark:border-zinc-700 bg-transparent">
                            {t("signIn")}
                          </Button>
                        </Link>
                        <Link href="/request" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full h-12 rounded-xl text-base bg-primary hover:bg-blue-700 text-white font-bold">
                            {t("getStarted")}
                          </Button>
                        </Link>
                      </>
                    )
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  )
}

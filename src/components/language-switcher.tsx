"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname() || "/"
  const router = useRouter()
  
  const currentLang = pathname.startsWith('/id') ? 'ID' : 'EN'

  const changeLocale = (locale: string) => {
    const currentLocaleMatch = pathname.match(/^\/(en|id)/)
    const currentLocale = currentLocaleMatch ? currentLocaleMatch[1] : 'en'
    
    let newPathname = pathname
    if (currentLocaleMatch) {
       newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`)
    } else {
       newPathname = `/${locale}${pathname === '/' ? '' : pathname}`
    }
    
    setIsOpen(false)
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`
    router.push(newPathname)
  }

  return (
    <div 
      className="relative z-50 flex items-center" 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <Globe className="w-4 h-4" />
        {currentLang}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 pt-2"
          >
            <div className="w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden p-1.5 flex flex-col gap-0.5">
              <button 
                onClick={() => changeLocale("en")}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${currentLang === 'EN' ? 'bg-primary/10 text-primary' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground'}`}
              >
                🇬🇧 English
              </button>
              <button 
                onClick={() => changeLocale("id")}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all ${currentLang === 'ID' ? 'bg-primary/10 text-primary' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground'}`}
              >
                🇮🇩 Indonesia
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

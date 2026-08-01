"use client"

import { motion } from "framer-motion"
import { ShieldCheck, LayoutDashboard} from "lucide-react"
import { useTranslations } from "next-intl"

export default function ProductsPage() {
  const t = useTranslations("ProductsPage")
  return (
    <div className="relative overflow-hidden flex flex-col items-center pb-24 bg-background min-h-screen">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-[0.04] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--foreground) 1.5px, transparent 0)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80%] md:w-[60%] h-[50%] rounded-full bg-blue-600/25 dark:bg-blue-600/30 blur-[120px] pointer-events-none" />

      {/* Header */}
      <section className="relative z-10 w-full max-w-7xl px-6 pt-40 pb-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground max-w-4xl">
            {t("title")} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
            {t("subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Features Detail */}
      <section className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col gap-12">
        
        {/* Feature 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="md:w-1/2 space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-foreground">{t("f1Title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("f1Desc")}
            </p>
          </div>
          <div className="md:w-1/2 w-full h-48 bg-muted rounded-2xl border border-border flex items-center justify-center">
            <span className="text-muted-foreground font-semibold">{t("f1Preview")}</span>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-secondary text-white p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row-reverse gap-8 items-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-transparent pointer-events-none" />
          <div className="md:w-1/2 space-y-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 text-accent rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black">{t("f2Title")}</h2>
            <p className="text-blue-100 leading-relaxed">
              {t("f2Desc")}
            </p>
          </div>
          <div className="md:w-1/2 w-full h-48 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative z-10 backdrop-blur-sm">
            <span className="text-blue-200 font-semibold">{t("f2Preview")}</span>
          </div>
        </motion.div>

      </section>
    </div>
  )
}

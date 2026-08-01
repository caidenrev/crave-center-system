"use client"

import { motion } from "framer-motion"
import { Building2, Code2, Briefcase } from "lucide-react"
import { useTranslations } from "next-intl"

export default function SolutionsPage() {
  const t = useTranslations("SolutionsPage")
  const solutions = [
    {
      title: t("s1Title"),
      icon: <Building2 className="w-8 h-8 text-primary" />,
      description: t("s1Desc"),
    },
    {
      title: t("s2Title"),
      icon: <Code2 className="w-8 h-8 text-accent" />,
      description: t("s2Desc"),
    },
    {
      title: t("s3Title"),
      icon: <Briefcase className="w-8 h-8 text-success" />,
      description: t("s3Desc"),
    }
  ]

  return (
    <div className="relative overflow-hidden flex flex-col items-center pb-24 bg-background min-h-screen">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-[0.04] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--foreground) 1.5px, transparent 0)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80%] md:w-[60%] h-[50%] rounded-full bg-blue-600/25 dark:bg-blue-600/30 blur-[120px] pointer-events-none" />

      {/* Header */}
      <section className="relative z-10 w-full max-w-7xl px-6 pt-40 pb-16 flex flex-col items-center text-center">
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

      {/* Solutions Grid */}
      <section className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {solutions.map((sol, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border p-8 rounded-3xl shadow-xl flex flex-col hover:border-primary/50 transition-colors"
          >
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
              {sol.icon}
            </div>
            <h3 className="text-2xl font-black text-foreground mb-4">{sol.title}</h3>
            <p className="text-muted-foreground leading-relaxed flex-1">
              {sol.description}
            </p>
          </motion.div>
        ))}
      </section>
    </div>
  )
}

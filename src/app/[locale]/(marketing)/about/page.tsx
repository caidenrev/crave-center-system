"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useTranslations } from "next-intl"

export default function AboutPage() {
  const t = useTranslations("AboutPage")
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
            {t("title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
            {t("subtitle")}
          </p>
        </motion.div>
      </section>

      <section className="relative z-10 w-full max-w-4xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-black prose-p:font-medium prose-p:leading-relaxed"
        >
          <h2>{t("problemTitle")}</h2>
          <p>
            {t("problem1")}
          </p>
          <p>
            {t("problem2")}
          </p>
          
          <h2>{t("enterTitle")}</h2>
          <p>
            {t("enter1")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 not-prose">
            <div className="bg-card border border-border p-8 rounded-3xl shadow-lg">
              <h3 className="text-xl font-black text-foreground mb-4">{t("missionTitle")}</h3>
              <p className="text-muted-foreground">{t("missionDesc")}</p>
            </div>
            <div className="bg-secondary p-8 rounded-3xl shadow-lg text-white">
              <h3 className="text-xl font-black mb-4">{t("visionTitle")}</h3>
              <p className="text-blue-100">{t("visionDesc")}</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

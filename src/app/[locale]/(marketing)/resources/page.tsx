"use client"

import { motion } from "framer-motion"
import { FileText, PlayCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function ResourcesPage() {
  const t = useTranslations("ResourcesPage")
  const resources = [
    {
      title: t("items.gettingStarted"),
      type: "Documentation",
      icon: <BookOpen className="w-5 h-5" />,
      tag: t("items.gettingStartedTag"),
      href: "/resources/getting-started"
    },
    {
      title: t("items.caseStudy"),
      type: "Case Study",
      icon: <FileText className="w-5 h-5" />,
      tag: t("items.caseStudyTag"),
      href: "/resources/case-study-globex"
    },
    {
      title: t("items.video"),
      type: "Video Tutorial",
      icon: <PlayCircle className="w-5 h-5" />,
      tag: t("items.videoTag"),
      href: "/resources/escrow-workflows"
    },
    {
      title: t("items.whitepaper"),
      type: "Whitepaper",
      icon: <FileText className="w-5 h-5" />,
      tag: t("items.whitepaperTag"),
      href: "/resources/sla-management"
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

      {/* Resources Grid */}
      <section className="relative z-10 w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((res, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={res.href} className="block p-8 rounded-3xl bg-card border border-border shadow-md hover:shadow-xl hover:border-primary/50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  {res.icon}
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-muted text-muted-foreground rounded-full">
                  {res.tag}
                </span>
              </div>
              <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
              <p className="text-sm font-semibold text-muted-foreground">{t("readMore")}</p>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  )
}

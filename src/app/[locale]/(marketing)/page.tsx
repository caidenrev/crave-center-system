"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Layers, LayoutDashboard, ShieldCheck, Zap, Server, ChevronRight, ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("Hero")
  const tHome = useTranslations("HomePage")
  const tWhy = useTranslations("WhyCrave")
  const tFAQ = useTranslations("FAQ")
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null)

  return (
    <div className="relative overflow-hidden flex flex-col items-center pb-24 bg-background">
      {/* Abstract Corporate Background Elements */}
      <div
        className="absolute inset-0 z-0 opacity-[0.1] dark:opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--foreground) 1.5px, transparent 0)', backgroundSize: '40px 40px' }}
      />
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80%] md:w-[60%] h-[50%] rounded-full bg-blue-600/25 dark:bg-blue-600/30 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 dark:bg-accent/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-7xl px-6 pt-40 pb-24 md:pt-48 md:pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-bold text-primary shadow-sm mb-4">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
            {t("badge")}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-foreground max-w-5xl leading-[1.05]">
            {t("title1")} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
              {t("title2")}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-semibold">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 w-full sm:w-auto">
            <Link href="/request" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold group rounded-xl bg-primary hover:bg-blue-700 text-white transition-all shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:-translate-y-1">
                {t("cta1")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-bold rounded-xl border-border hover:bg-muted text-foreground transition-all hover:-translate-y-1 bg-white dark:bg-card">
                {t("cta2")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Corporate Trusted By Section */}
      <section className="w-full py-12 relative z-10 border-y border-border bg-card/50 overflow-hidden">
        <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8 px-6">{tHome("trustedBy")}</p>
        <div className="relative flex overflow-hidden w-full opacity-60 grayscale hover:grayscale-0 transition-all duration-500 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <motion.div
            className="flex w-max items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 md:gap-24 px-6 md:px-12">
                <div className="text-xl font-black font-mono tracking-tighter shrink-0">AcmeCorp</div>
                <div className="text-xl font-black font-sans tracking-tight shrink-0">Globex</div>
                <div className="text-xl font-black font-serif italic shrink-0">Soylent</div>
                <div className="text-xl font-black font-mono tracking-widest shrink-0">INITECH</div>
                <div className="text-xl font-black font-sans tracking-tighter shrink-0">Hooli</div>
                <div className="text-xl font-black font-serif tracking-widest shrink-0">InGen</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enterprise Bento Grid Features */}
      <section id="features" className="w-full max-w-7xl px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">
            {tHome("featuresTitle")}
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg">
            {tHome("featuresSubtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {/* Feature 1 - Large Primary */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="md:col-span-2 p-10 rounded-3xl bg-secondary text-white shadow-2xl overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black mb-4">{tHome("cmdCenterTitle")}</h3>
                <p className="text-blue-100 font-medium leading-relaxed max-w-md text-lg">
                  {tHome("cmdCenterDesc")}
                </p>
              </div>
              <div className="mt-8">
                <span className="inline-flex items-center text-white font-bold group-hover:translate-x-2 transition-transform">
                  {tHome("cmdCenterLink")} <ChevronRight className="ml-1 w-5 h-5" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Feature 2 - Small Accent */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-10 rounded-3xl bg-card border border-border shadow-xl overflow-hidden relative group"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4">{tHome("securityTitle")}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {tHome("securityDesc")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature 3 - Small */}
          <motion.div
            whileHover={{ y: -8 }}
            className="p-10 rounded-3xl bg-card border border-border shadow-xl overflow-hidden relative group"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4">{tHome("gatekeeperTitle")}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {tHome("gatekeeperDesc")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature 4 - Large Image/Illustration placeholder */}
          <motion.div
            whileHover={{ y: -8 }}
            className="md:col-span-2 p-10 rounded-3xl bg-card border border-border shadow-xl overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full flex flex-col md:flex-row gap-8 justify-between items-center">
              <div className="md:w-1/2">
                <div className="w-14 h-14 bg-success/10 text-success rounded-2xl flex items-center justify-center mb-8">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-4">{tHome("workflowTitle")}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed mb-6">
                  {tHome("workflowDesc")}
                </p>
              </div>
              <div className="md:w-1/2 w-full h-48 bg-muted rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <Server className="w-16 h-16 text-muted-foreground/30" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Crave Section */}
      <section className="w-full max-w-4xl mx-auto px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">
            {tWhy("title")}
          </h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            {tWhy("subtitle")}
          </p>
        </motion.div>

        <div className="flex flex-col space-y-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border border-border shadow-lg flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-2xl shrink-0">
                {i}
              </div>
              <div className="text-left">
                <h4 className="text-2xl font-bold mb-2">{tWhy(`reason${i}Title` as any)}</h4>
                <p className="text-muted-foreground text-lg leading-relaxed">{tWhy(`reason${i}Desc` as any)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6">
            {tFAQ("title")}
          </h2>
          <p className="text-muted-foreground font-medium text-lg">
            {tFAQ("subtitle")}
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 text-left">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                className="w-full p-6 md:p-8 text-left flex items-center justify-between hover:bg-muted/50 transition-colors focus:outline-none"
              >
                <h4 className="text-lg md:text-xl font-bold text-foreground pr-8">{tFAQ(`q${i}` as any)}</h4>
                <motion.div
                  animate={{ rotate: activeFAQ === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 text-muted-foreground bg-muted p-2 rounded-full"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeFAQ === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-6 md:p-8 pt-0 text-muted-foreground text-lg leading-relaxed">
                      <div className="pt-6 border-t border-border/50">
                        {tFAQ(`a${i}` as any)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 relative z-10 text-center">
        <div className="rounded-[3rem] p-12 md:p-24 shadow-2xl relative overflow-hidden border border-white/10 bg-zinc-950">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-indigo-900/40 to-purple-800/40 z-0" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/30 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-violet-600/30 rounded-full blur-[120px]"
          />

          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight">
              {tHome("ctaTitle1")} <br className="hidden md:block" /> {tHome("ctaTitle2")}
            </h3>
            <p className="text-blue-200/80 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
              Wujudkan ide Anda menjadi nyata. Platform pemesanan layanan IT terpadu dengan transparansi penuh dari awal negosiasi hingga serah terima.
            </p>
            <Link href="/request">
              <Button size="lg" className="group h-16 px-10 text-lg font-bold rounded-2xl bg-white text-zinc-950 hover:bg-zinc-100 hover:text-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
                {tHome("ctaBtn")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Layers, LayoutDashboard, ShieldCheck, Zap, Server, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("Hero")
  const tHome = useTranslations("HomePage")

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
        <div className="flex w-full items-center justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-xl font-black font-mono tracking-tighter shrink-0">AcmeCorp</div>
          <div className="text-xl font-black font-sans tracking-tight shrink-0">Globex</div>
          <div className="text-xl font-black font-serif italic shrink-0">Soylent</div>
          <div className="text-xl font-black font-mono tracking-widest shrink-0">INITECH</div>
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
                <div className="w-14 h-14 bg-white/10 text-accent rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black mb-4">{tHome("cmdCenterTitle")}</h3>
                <p className="text-blue-100 font-medium leading-relaxed max-w-md text-lg">
                  {tHome("cmdCenterDesc")}
                </p>
              </div>
              <div className="mt-8">
                <span className="inline-flex items-center text-accent font-bold group-hover:translate-x-2 transition-transform">
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

      {/* Final CTA Section */}
      <section className="w-full max-w-5xl px-6 py-24 relative z-10 text-center">
        <div className="bg-secondary rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/40 to-transparent opacity-50" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">{tHome("ctaTitle1")} <br/> {tHome("ctaTitle2")}</h3>
            <Link href="/request">
              <Button size="lg" className="h-16 px-12 text-lg font-bold rounded-xl bg-white text-secondary hover:bg-accent hover:text-white shadow-xl transition-all hover:scale-105">
                {tHome("ctaBtn")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

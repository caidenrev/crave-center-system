"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowRight, CheckCircle2, 
  LayoutTemplate, Store, PenTool, Terminal, Image as ImageIcon, Share2, Briefcase, Presentation, GraduationCap 
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ServicesPage() {
  const t = useTranslations("ServicesPage")
  const [activeCategory, setActiveCategory] = useState<"it" | "creative">("it")
  const [activeService, setActiveService] = useState<string>("s1")

  const categories = [
    { id: "it", title: t("catIT") },
    { id: "creative", title: t("catCreative") }
  ] as const

  const services = [
    // IT Services
    { 
      id: "s1", category: "it", 
      title: t("s1Title"), desc: t("s1Desc"), 
      overview: t("s1Overview"), features: [t("s1F1"), t("s1F2"), t("s1F3")], 
      icon: <LayoutTemplate className="w-6 h-6" />
    },
    { 
      id: "s2", category: "it", 
      title: t("s2Title"), desc: t("s2Desc"), 
      overview: t("s2Overview"), features: [t("s2F1"), t("s2F2"), t("s2F3")], 
      icon: <Store className="w-6 h-6" />
    },
    { 
      id: "s3", category: "it", 
      title: t("s3Title"), desc: t("s3Desc"), 
      overview: t("s3Overview"), features: [t("s3F1"), t("s3F2"), t("s3F3")], 
      icon: <PenTool className="w-6 h-6" />
    },
    { 
      id: "s4", category: "it", 
      title: t("s4Title"), desc: t("s4Desc"), 
      overview: t("s4Overview"), features: [t("s4F1"), t("s4F2"), t("s4F3")], 
      icon: <Terminal className="w-6 h-6" />
    },
    // Creative & Non-IT Services
    { 
      id: "s5", category: "creative", 
      title: t("s5Title"), desc: t("s5Desc"), 
      overview: t("s5Overview"), features: [t("s5F1"), t("s5F2"), t("s5F3")], 
      icon: <ImageIcon className="w-6 h-6" />
    },
    { 
      id: "s6", category: "creative", 
      title: t("s6Title"), desc: t("s6Desc"), 
      overview: t("s6Overview"), features: [t("s6F1"), t("s6F2"), t("s6F3")], 
      icon: <Share2 className="w-6 h-6" />
    },
    { 
      id: "s7", category: "creative", 
      title: t("s7Title"), desc: t("s7Desc"), 
      overview: t("s7Overview"), features: [t("s7F1"), t("s7F2"), t("s7F3")], 
      icon: <Briefcase className="w-6 h-6" />
    },
    { 
      id: "s8", category: "creative", 
      title: t("s8Title"), desc: t("s8Desc"), 
      overview: t("s8Overview"), features: [t("s8F1"), t("s8F2"), t("s8F3")], 
      icon: <Presentation className="w-6 h-6" />
    },
    { 
      id: "s9", category: "creative", 
      title: t("s9Title"), desc: t("s9Desc"), 
      overview: t("s9Overview"), features: [t("s9F1"), t("s9F2"), t("s9F3")], 
      icon: <GraduationCap className="w-6 h-6" />
    }
  ]

  const activeServicesList = services.filter(s => s.category === activeCategory)
  
  // Auto select first service when category changes
  const handleCategoryChange = (cat: "it" | "creative") => {
    setActiveCategory(cat)
    setActiveService(cat === "it" ? "s1" : "s5")
  }

  const selectedService = services.find(s => s.id === activeService)

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
            {t("title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
            {t("subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Interactive Services Section */}
      <section className="relative z-10 w-full max-w-6xl px-6 py-12">
        
        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-muted/50 p-1.5 rounded-full border border-border/50 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id as "it" | "creative")}
                className={cn(
                  "px-8 py-3 rounded-full text-sm md:text-base font-bold transition-all relative",
                  activeCategory === cat.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-background shadow-sm rounded-full border border-border/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Two-Pane Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Pane: Services List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {activeServicesList.map((service) => (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => setActiveService(service.id)}
                  className={cn(
                    "text-left p-5 rounded-2xl transition-all border flex items-center gap-4 group",
                    activeService === service.id 
                      ? "bg-card border-primary/50 shadow-md ring-1 ring-primary/20" 
                      : "bg-muted/40 border-transparent hover:bg-muted/70"
                  )}
                >
                  <div className={cn("shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", "bg-primary/10 text-primary")}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{service.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{service.desc}</p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Pane: Service Details */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              {selectedService && (
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card border border-border p-8 md:p-10 rounded-3xl shadow-xl h-full flex flex-col"
                >
                  <div className="flex items-center gap-5 mb-8">
                     <div className={cn("shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center", "bg-primary/10 text-primary")}>
                       {selectedService.icon}
                     </div>
                     <div>
                       <h2 className="text-3xl font-black text-foreground">{selectedService.title}</h2>
                       <p className="text-muted-foreground font-medium mt-1">{categories.find(c => c.id === selectedService.category)?.title}</p>
                     </div>
                  </div>

                  <div className="space-y-8 flex-grow">
                    <div>
                      <h4 className="text-lg font-bold mb-3 text-foreground">Overview</h4>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {selectedService.overview}
                      </p>
                    </div>

                    <div>
                       <h4 className="text-lg font-bold mb-4 text-foreground">Key Features</h4>
                       <ul className="space-y-3">
                         {selectedService.features.map((feature, idx) => (
                           <li key={idx} className="flex items-start gap-3">
                             <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                             <span className="text-muted-foreground font-medium">{feature}</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                  </div>
                  
                  <div className="mt-10 pt-8 border-t border-border">
                    <Link href="/request">
                       <Button className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold group">
                         Order this service
                         <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </section>

      {/* CTA */}
      <section className="relative z-10 w-full max-w-4xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-zinc-950 rounded-[3rem] p-12 md:p-16 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-purple-800/30" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">{t("ctaTitle")}</h2>
            <Link href="/request">
              <Button size="lg" className="group h-14 px-8 text-lg font-bold rounded-2xl bg-white text-zinc-950 hover:bg-zinc-100 transition-all hover:-translate-y-1 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                {t("ctaBtn")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

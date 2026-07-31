"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export default function PricingPage() {
  const t = useTranslations("PricingPage")
  const plans = [
    {
      name: t("plans.starter.name"),
      price: "$0",
      description: t("plans.starter.desc"),
      features: [t("plans.starter.f1"), t("plans.starter.f2"), t("plans.starter.f3"), t("plans.starter.f4")],
      missing: [t("missing.rbac"), t("missing.escrow"), t("missing.domain")],
      cta: t("plans.starter.cta"),
      highlight: false
    },
    {
      name: t("plans.pro.name"),
      price: "$49",
      period: "/month",
      description: t("plans.pro.desc"),
      features: [t("plans.pro.f1"), t("plans.pro.f2"), t("plans.pro.f3"), t("plans.pro.f4"), t("plans.pro.f5")],
      missing: [t("missing.domain")],
      cta: t("plans.pro.cta"),
      highlight: true
    },
    {
      name: t("plans.enterprise.name"),
      price: "Custom",
      description: t("plans.enterprise.desc"),
      features: [t("plans.enterprise.f1"), t("plans.enterprise.f2"), t("plans.enterprise.f3"), t("plans.enterprise.f4"), t("plans.enterprise.f5")],
      missing: [],
      cta: t("plans.enterprise.cta"),
      highlight: false
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
            {t("title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
            {t("subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Pricing Grid / Slider on Mobile */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 md:pb-0 items-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`shrink-0 w-full md:w-auto snap-center flex flex-col p-8 rounded-3xl ${plan.highlight ? 'bg-secondary text-white shadow-none md:shadow-2xl md:scale-105 border-none' : 'bg-card border border-border shadow-none md:shadow-xl'}`}
          >
            {plan.highlight && (
              <div className="text-xs font-bold uppercase tracking-widest text-accent mb-4">{t("mostPopular")}</div>
            )}
            <h3 className={`text-2xl font-black mb-2 ${plan.highlight ? 'text-white' : 'text-foreground'}`}>{plan.name}</h3>
            <div className="mb-4 flex items-baseline gap-1">
              <span className="text-5xl font-black">{plan.price}</span>
              {plan.period && <span className={plan.highlight ? 'text-blue-200' : 'text-muted-foreground'}>{plan.period}</span>}
            </div>
            <p className={`mb-8 ${plan.highlight ? 'text-blue-100' : 'text-muted-foreground'}`}>{plan.description}</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3">
                  <Check className={`w-5 h-5 ${plan.highlight ? 'text-accent' : 'text-primary'}`} />
                  <span className={`text-sm font-semibold ${plan.highlight ? 'text-white' : 'text-foreground'}`}>{feature}</span>
                </li>
              ))}
              {plan.missing.map((feature, j) => (
                <li key={`m-${j}`} className="flex items-center gap-3 opacity-50">
                  <X className="w-5 h-5" />
                  <span className="text-sm font-semibold line-through">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              size="lg" 
              variant={plan.highlight ? "default" : "outline"} 
              className={`w-full h-12 rounded-xl font-bold ${plan.highlight ? 'bg-primary hover:bg-blue-600 text-white shadow-lg' : ''}`}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
        </div>
      </section>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Target, Lightbulb} from "lucide-react"

export default function AboutPage() {
  const t = useTranslations("AboutPage")

  const team = [
    { name: t("founder1"), role: t("founderRole"), initials: "ER", color: "from-blue-500 to-cyan-400", desc: t("founderDesc") },
    { name: t("founder2"), role: t("founderRole"), initials: "IS", color: "from-purple-500 to-pink-500", desc: t("founderDesc") },
    { name: t("founder3"), role: t("founderRole"), initials: "AW", color: "from-orange-400 to-red-500", desc: t("founderDesc") },
  ]

  return (
    <div className="relative overflow-hidden flex flex-col items-center pb-24 bg-background min-h-screen">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-[0.04] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--foreground) 1.5px, transparent 0)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      {/* Header */}
      <section className="relative z-10 w-full max-w-5xl px-6 pt-40 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground">
            {t("title")} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>
      </section>

      {/* The Story Section */}
      <section className="relative z-10 w-full max-w-5xl px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden relative"
        >
          {/* Decorative glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-foreground">{t("storyTitle")}</h2>
          
          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            {/* The Problem */}
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-lg md:text-xl font-medium">
                {t("storyP1")}
              </p>
            </div>
            
            {/* The Solution */}
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-lg md:text-xl font-medium">
                {t("storyP2")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="relative z-10 w-full max-w-5xl px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-secondary text-white rounded-3xl p-10 md:p-12 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full transition-transform group-hover:scale-110" />
            <Target className="w-10 h-10 mb-6 text-blue-200" />
            <h3 className="text-2xl font-black mb-4">{t("missionTitle")}</h3>
            <p className="text-blue-100/90 leading-relaxed text-lg relative z-10">
              {t("missionDesc")}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-12 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-bl-full transition-transform group-hover:scale-110" />
            <Lightbulb className="w-10 h-10 mb-6 text-primary-foreground/80" />
            <h3 className="text-2xl font-black mb-4">{t("visionTitle")}</h3>
            <p className="text-primary-foreground/90 leading-relaxed text-lg relative z-10">
              {t("visionDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 w-full max-w-5xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            {t("teamTitle")} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">{t("teamTitleHighlight")}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            {t("teamSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group w-full h-[320px] cursor-pointer [perspective:1000px]"
            >
              <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-card border border-border p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center">
                  <div className={`w-28 h-28 rounded-full mb-6 flex items-center justify-center bg-linear-to-br ${member.color} text-white text-4xl font-black shadow-inner`}>
                    {member.initials}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-muted-foreground font-medium">{member.role}</p>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary text-primary-foreground p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center">
                  <h3 className="text-2xl font-bold mb-4">{member.name}</h3>
                  <p className="text-primary-foreground/90 leading-relaxed font-medium">
                    {member.desc}
                  </p>
                </div>
                
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { Briefcase, CheckCircle2, Zap, Shield, ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function CareersPage() {
  const t = await getTranslations('Careers')

  return (
    <div className="min-h-screen pt-32 pb-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl mb-6">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{t('benefit1Title')}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t('benefit1Desc')}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{t('benefit2Title')}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t('benefit2Desc')}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{t('benefit3Title')}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t('benefit3Desc')}
            </p>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-zinc-900 dark:bg-black rounded-3xl p-8 md:p-12 text-white mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8">{t('requirementsTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-zinc-300">{t('req1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-zinc-300">{t('req2')}</span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-zinc-300">{t('req3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-zinc-300">{t('req4')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">{t('ctaTitle')}</h2>
          <Link 
            href="/apply" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary hover:bg-blue-700 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            {t('ctaButton')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <p className="mt-4 text-sm text-zinc-500">{t('ctaSub')}</p>
        </div>

      </div>
    </div>
  )
}

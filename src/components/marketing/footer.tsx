import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/light-mode-logo.png" alt="Crave Logo" className="h-10 w-auto dark:hidden transition-transform group-hover:scale-105" />
              <img src="/dark-mode-logo.png" alt="Crave Logo" className="h-10 w-auto hidden dark:block transition-transform group-hover:scale-105" />
              <span className="font-bold tracking-tight text-2xl text-zinc-900 dark:text-white">Crave</span>
            </Link>
            <p className="text-base max-w-sm leading-relaxed">
              Platform B2B ITSM modern untuk mengelola proyek IT Anda dari request hingga delivery dengan transparansi penuh.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Fitur Utama</Link></li>
              <li><Link href="/client/request/new" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Mulai Project Baru</Link></li>
              <li><Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Client Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Perusahaan</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Hubungi Kami</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Crave ITSM. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </footer>
  )
}

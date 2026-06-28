'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, TrendingUp, Landmark, Users, BarChart3, LogOut, Menu, X, Gem
} from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/purchases', label: 'خرید طلا', icon: ShoppingCart },
  { href: '/admin/sales', label: 'فروش و فاکتور', icon: TrendingUp },
  { href: '/admin/banking', label: 'بنکداری', icon: Landmark },
  { href: '/admin/customers', label: 'مشتریان', icon: Users },
  { href: '/admin/reports', label: 'گزارشات', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem('gold_admin_auth');
    if (!ok && path !== '/admin') {
      router.replace('/admin');
    } else if (ok) {
      setAuthed(true);
    }
  }, [path, router]);

  const logout = () => {
    sessionStorage.removeItem('gold_admin_auth');
    router.replace('/admin');
  };

  if (path === '/admin') {
    return <>{children}</>;
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#0D0B08] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-l border-[#C9A84C]/20 bg-[#110E09] fixed right-0 top-0 h-full z-40">
        <div className="p-6 border-b border-[#C9A84C]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
              <Gem size={20} className="text-[#0D0B08]" />
            </div>
            <div>
              <p className="text-[#E8C96A] font-bold text-sm">آسنا گلدن</p>
              <p className="text-[#C9A84C]/60 text-xs">پنل مدیریت</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href);
            return (
              <motion.a
                key={href}
                href={href}
                whileHover={{ x: -4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  active
                    ? 'bg-[#C9A84C]/15 text-[#E8C96A] border border-[#C9A84C]/30'
                    : 'text-[#FAF7F0]/60 hover:text-[#E8C96A] hover:bg-[#C9A84C]/5'
                }`}
              >
                <Icon size={18} />
                {label}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="mr-auto w-1.5 h-1.5 rounded-full bg-[#E8C96A]"
                  />
                )}
              </motion.a>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#C9A84C]/20">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut size={18} />
            خروج
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 right-0 left-0 z-50 bg-[#110E09] border-b border-[#C9A84C]/20 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSideOpen(true)} className="text-[#C9A84C]">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Gem size={18} className="text-[#C9A84C]" />
          <span className="text-[#E8C96A] font-bold text-sm">آسنا گلدن</span>
        </div>
        <button onClick={logout} className="text-red-400">
          <LogOut size={20} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setSideOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-72 bg-[#110E09] z-50 md:hidden border-l border-[#C9A84C]/20"
            >
              <div className="p-6 border-b border-[#C9A84C]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                    <Gem size={20} className="text-[#0D0B08]" />
                  </div>
                  <div>
                    <p className="text-[#E8C96A] font-bold text-sm">آسنا گلدن</p>
                    <p className="text-[#C9A84C]/60 text-xs">پنل مدیریت</p>
                  </div>
                </div>
                <button onClick={() => setSideOpen(false)} className="text-[#FAF7F0]/40">
                  <X size={20} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {NAV.map(({ href, label, icon: Icon }) => {
                  const active = path.startsWith(href);
                  return (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setSideOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        active
                          ? 'bg-[#C9A84C]/15 text-[#E8C96A] border border-[#C9A84C]/30'
                          : 'text-[#FAF7F0]/60 hover:text-[#E8C96A]'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </a>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:mr-64 pt-16 md:pt-0 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

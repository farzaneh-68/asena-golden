'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard, ShoppingCart, TrendingUp, Landmark, Users, BarChart3, LogOut, Menu, X
} from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

const NAV = [
  { href: '/admin/dashboard', label: 'داشبورد',       icon: LayoutDashboard },
  { href: '/admin/purchases', label: 'خرید طلا',      icon: ShoppingCart },
  { href: '/admin/sales',     label: 'فروش و فاکتور', icon: TrendingUp },
  { href: '/admin/banking',   label: 'بنکداری',       icon: Landmark },
  { href: '/admin/customers', label: 'مشتریان',       icon: Users },
  { href: '/admin/reports',   label: 'گزارشات',       icon: BarChart3 },
];

function Logo({ size = 48 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${BASE}/logo.jpg`}
      alt="آسنا گلدن"
      width={size}
      height={size}
      className="rounded-xl object-contain"
      style={{ background: '#fff' }}
    />
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem('gold_admin_auth');
    if (!ok && path !== '/admin') router.replace('/admin');
    else if (ok) setAuthed(true);
  }, [path, router]);

  const logout = () => {
    sessionStorage.removeItem('gold_admin_auth');
    router.replace('/admin');
  };

  if (path === '/admin') return <>{children}</>;
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#0D0B08] flex" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 border-l border-[#C9A84C]/20 bg-[#0F0C08] fixed right-0 top-0 h-full z-40">
        {/* Logo */}
        <div className="p-5 border-b border-[#C9A84C]/15">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div>
              <p className="text-[#E8C96A] font-bold text-sm leading-tight">آسنا گلدن</p>
              <p className="text-[#C9A84C]/50 text-xs mt-0.5">پنل مدیریت</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }, i) => {
            const active = path.startsWith(href);
            return (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={href}>
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer group ${
                    active
                      ? 'bg-gradient-to-l from-[#C9A84C]/20 to-[#C9A84C]/5 text-[#E8C96A] border border-[#C9A84C]/25'
                      : 'text-[#FAF7F0]/50 hover:text-[#E8C96A] hover:bg-[#C9A84C]/5'
                  }`}>
                    <Icon size={17} className={active ? 'text-[#E8C96A]' : 'text-[#C9A84C]/50 group-hover:text-[#C9A84C]'} />
                    <span>{label}</span>
                    {active && (
                      <motion.div layoutId="dot" className="mr-auto w-1.5 h-1.5 rounded-full bg-[#E8C96A]" />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#C9A84C]/15">
          <button onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/8 w-full transition-all">
            <LogOut size={17} />
            خروج از پنل
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 right-0 left-0 z-50 bg-[#0F0C08]/95 backdrop-blur-md border-b border-[#C9A84C]/15 px-4 py-2.5 flex items-center justify-between">
        <button onClick={logout} className="text-red-400/70 p-1">
          <LogOut size={20} />
        </button>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE}/logo.jpg`} alt="آسنا گلدن" width={32} height={32}
            className="rounded-lg object-contain" style={{ background: '#fff' }} />
          <span className="text-[#E8C96A] font-bold text-sm">آسنا گلدن</span>
        </div>
        <button onClick={() => setSideOpen(true)} className="text-[#C9A84C] p-1">
          <Menu size={22} />
        </button>
      </div>


      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {sideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"
              onClick={() => setSideOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-72 bg-[#0F0C08] z-50 md:hidden border-l border-[#C9A84C]/20"
            >
              <div className="p-5 border-b border-[#C9A84C]/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Logo size={40} />
                  <div>
                    <p className="text-[#E8C96A] font-bold text-sm">آسنا گلدن</p>
                    <p className="text-[#C9A84C]/50 text-xs">پنل مدیریت</p>
                  </div>
                </div>
                <button onClick={() => setSideOpen(false)} className="text-[#FAF7F0]/30">
                  <X size={20} />
                </button>
              </div>
              <nav className="p-3 space-y-0.5">
                {NAV.map(({ href, label, icon: Icon }) => {
                  const active = path.startsWith(href);
                  return (
                    <Link key={href} href={href} onClick={() => setSideOpen(false)}>
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        active
                          ? 'bg-[#C9A84C]/15 text-[#E8C96A] border border-[#C9A84C]/25'
                          : 'text-[#FAF7F0]/50 hover:text-[#E8C96A]'
                      }`}>
                        <Icon size={17} />
                        <span>{label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <main className="flex-1 md:mr-64 pt-14 md:pt-0 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="p-4 md:p-7"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

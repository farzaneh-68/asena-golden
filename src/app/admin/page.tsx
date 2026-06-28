'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gem, Lock, Eye, EyeOff } from 'lucide-react';

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS ?? 'Gold@1403';

export default function AdminLogin() {
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pass === ADMIN_PASS) {
        sessionStorage.setItem('gold_admin_auth', '1');
        router.replace('/admin/dashboard');
      } else {
        setErr(true);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0D0B08] flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              background: `radial-gradient(circle, rgba(201,168,76,${0.03 + i * 0.01}) 0%, transparent 70%)`,
              left: `${10 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex w-20 h-20 rounded-2xl gold-gradient items-center justify-center mb-4 shadow-[0_0_40px_rgba(201,168,76,0.3)]"
          >
            <Gem size={36} className="text-[#0D0B08]" />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#E8C96A] mb-1">آسنا گلدن</h1>
          <p className="text-[#C9A84C]/60 text-sm">پنل مدیریت طلافروشی</p>
        </div>

        {/* Card */}
        <div className="bg-[#110E09] border border-[#C9A84C]/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-[#C9A84C]" />
            <span className="text-[#FAF7F0]/60 text-sm">ورود به پنل مدیریت</span>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div className="relative">
              <label className="text-xs text-[#C9A84C]/80 mb-1.5 block">رمز عبور</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={pass}
                  onChange={e => { setPass(e.target.value); setErr(false); }}
                  placeholder="رمز عبور را وارد کنید"
                  className={`w-full bg-[#0D0B08] border ${err ? 'border-red-500' : 'border-[#C9A84C]/20'} rounded-xl px-4 py-3 text-[#FAF7F0] placeholder-[#FAF7F0]/20 outline-none focus:border-[#C9A84C]/60 transition-all text-sm`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A84C]/40 hover:text-[#C9A84C]"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {err && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1"
                >
                  رمز عبور اشتباه است
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full gold-gradient py-3 rounded-xl text-[#0D0B08] font-bold text-sm relative overflow-hidden"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-5 h-5 border-2 border-[#0D0B08]/30 border-t-[#0D0B08] rounded-full"
                />
              ) : 'ورود'}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-[#C9A84C]/30 text-xs mt-4">
          رمز پیش‌فرض: Gold@1403
        </p>
      </motion.div>
    </div>
  );
}

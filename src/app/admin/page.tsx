'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

const ADMIN_PASS = 'asena1403';

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
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0D0B08] flex items-center justify-center p-4"
      style={{ fontFamily: 'Vazirmatn, sans-serif' }}>

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#C9A84C]/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm relative"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-block rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(201,168,76,0.25)] mb-4 border border-[#C9A84C]/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE}/logo.jpg`}
              alt="آسنا گلدن"
              width={120}
              height={120}
              className="object-contain bg-white block"
            />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-[#E8C96A] mb-1"
          >
            آسنا گلدن
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#C9A84C]/50 text-sm"
          >
            پنل مدیریت طلافروشی
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="bg-[#110E09] border border-[#C9A84C]/20 rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-5">
            <Lock size={14} className="text-[#C9A84C]" />
            <span className="text-[#FAF7F0]/40 text-xs">ورود به پنل مدیریت</span>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="text-xs text-[#C9A84C]/70 mb-1.5 block">رمز عبور</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={pass}
                  onChange={e => { setPass(e.target.value); setErr(false); }}
                  placeholder="رمز عبور را وارد کنید"
                  className={`w-full bg-[#0D0B08] border ${err ? 'border-red-500' : 'border-[#C9A84C]/20'} rounded-xl px-4 py-3 text-[#FAF7F0] placeholder-[#FAF7F0]/15 outline-none focus:border-[#C9A84C]/50 transition-all text-sm`}
                  dir="ltr"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A84C]/30 hover:text-[#C9A84C] transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <AnimatedError show={err} />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full gold-gradient py-3 rounded-xl text-[#0D0B08] font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-[#0D0B08]/30 border-t-[#0D0B08] rounded-full"
                />
              ) : 'ورود'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

function AnimatedError({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: show ? 'auto' : 0, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <p className="text-red-400 text-xs mt-1.5">رمز عبور اشتباه است</p>
    </motion.div>
  );
}

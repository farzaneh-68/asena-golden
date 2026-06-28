'use client';
import { useState, useEffect } from 'react';
import { todayJalali, toJalali, toGregorian } from '@/lib/date';

interface Props {
  value: string; // Gregorian YYYY-MM-DD
  onChange: (gregorian: string) => void;
  required?: boolean;
  className?: string;
}

export default function DateInput({ value, onChange, required, className }: Props) {
  const [display, setDisplay] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (value) setDisplay(toJalali(value));
    else setDisplay(todayJalali());
  }, []);

  const handleChange = (raw: string) => {
    setDisplay(raw);
    const cleaned = raw.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(cleaned)) {
      const greg = toGregorian(cleaned);
      if (greg) {
        onChange(greg);
        setError(false);
      } else {
        setError(true);
      }
    } else {
      setError(false);
    }
  };

  const handleBlur = () => {
    const cleaned = display.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
    if (display && !/^\d{4}\/\d{2}\/\d{2}$/.test(cleaned)) {
      setError(true);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={display}
        onChange={e => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="۱۴۰۳/۰۱/۰۱"
        required={required}
        dir="ltr"
        className={`${className} ${error ? 'border-red-500' : ''} text-center`}
      />
      {error && <p className="text-red-400 text-xs mt-1">فرمت صحیح: ۱۴۰۳/۰۱/۰۱</p>}
    </div>
  );
}

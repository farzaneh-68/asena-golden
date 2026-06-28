import { toJalaali as _toJ, toGregorian as _toG } from 'jalaali-js';

export function toJalali(gregorianDate: string): string {
  if (!gregorianDate) return '';
  try {
    const d = new Date(gregorianDate);
    const { jy, jm, jd } = _toJ(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
  } catch {
    return gregorianDate;
  }
}

export function toGregorian(jalaliDate: string): string {
  if (!jalaliDate) return '';
  try {
    const parts = jalaliDate.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).split('/');
    if (parts.length !== 3) return '';
    const { gy, gm, gd } = _toG(Number(parts[0]), Number(parts[1]), Number(parts[2]));
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

export function todayJalali(): string {
  const now = new Date();
  const { jy, jm, jd } = _toJ(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}

const JALALI_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

export function toJalaliLong(gregorianDate: string): string {
  if (!gregorianDate) return '';
  try {
    const d = new Date(gregorianDate);
    const { jy, jm, jd } = _toJ(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`;
  } catch {
    return gregorianDate;
  }
}

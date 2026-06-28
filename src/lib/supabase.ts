import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
};

export type Purchase = {
  id: string;
  date: string;
  supplier?: string;
  weight: number;
  karat: number;
  price_per_gram: number;
  total_price: number;
  wage: number;
  notes?: string;
  created_at: string;
};

export type Sale = {
  id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name?: string;
  date: string;
  weight: number;
  karat: number;
  price_per_gram: number;
  total_gold_price: number;
  wage: number;
  tax: number;
  total_price: number;
  buy_price_per_gram?: number;
  profit?: number;
  notes?: string;
  created_at: string;
};

export type Banking = {
  id: string;
  date: string;
  customer_id?: string;
  customer_name?: string;
  weight: number;
  karat: number;
  buy_price_per_gram: number;
  sell_price_per_gram: number;
  total_buy: number;
  total_sell: number;
  profit: number;
  notes?: string;
  created_at: string;
};

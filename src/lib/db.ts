import { supabase } from './supabase';
import type { Customer, Purchase, Sale, Banking } from './supabase';

// ─── Customers ───────────────────────────────────────────────
export const getCustomers = async () => {
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Customer[];
};
export const addCustomer = async (c: Omit<Customer, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('customers').insert(c).select().single();
  if (error) throw error;
  return data as Customer;
};
export const deleteCustomer = async (id: string) => {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  if (error) throw error;
};

// ─── Purchases ───────────────────────────────────────────────
export const getPurchases = async () => {
  const { data, error } = await supabase.from('purchases').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data as Purchase[];
};
export const addPurchase = async (p: Omit<Purchase, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('purchases').insert(p).select().single();
  if (error) throw error;
  return data as Purchase;
};
export const deletePurchase = async (id: string) => {
  const { error } = await supabase.from('purchases').delete().eq('id', id);
  if (error) throw error;
};

// ─── Sales ───────────────────────────────────────────────────
export const getSales = async () => {
  const { data, error } = await supabase.from('sales').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data as Sale[];
};
export const addSale = async (s: Omit<Sale, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('sales').insert(s).select().single();
  if (error) throw error;
  return data as Sale;
};
export const deleteSale = async (id: string) => {
  const { error } = await supabase.from('sales').delete().eq('id', id);
  if (error) throw error;
};

// ─── Banking ─────────────────────────────────────────────────
export const getBankings = async () => {
  const { data, error } = await supabase.from('banking').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data as Banking[];
};
export const addBanking = async (b: Omit<Banking, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('banking').insert(b).select().single();
  if (error) throw error;
  return data as Banking;
};
export const deleteBanking = async (id: string) => {
  const { error } = await supabase.from('banking').delete().eq('id', id);
  if (error) throw error;
};

// ─── Stats ───────────────────────────────────────────────────
export const getStats = async () => {
  const [purchases, sales, bankings] = await Promise.all([
    getPurchases(),
    getSales(),
    getBankings(),
  ]);

  const totalBought = purchases.reduce((s, p) => s + p.total_price, 0);
  const totalSold = sales.reduce((s, p) => s + p.total_price, 0);
  const salesProfit = sales.reduce((s, p) => s + (p.profit ?? 0), 0);
  const bankingProfit = bankings.reduce((s, p) => s + p.profit, 0);
  const totalProfit = salesProfit + bankingProfit;

  const totalGoldBought = purchases.reduce((s, p) => s + p.weight, 0);
  const totalGoldSold = sales.reduce((s, p) => s + p.weight, 0);

  return { totalBought, totalSold, totalProfit, totalGoldBought, totalGoldSold, salesCount: sales.length };
};

export const fmt = (n: number) =>
  new Intl.NumberFormat('fa-IR').format(Math.round(n));

-- اجرای این دستورات در Supabase SQL Editor

create table customers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text,
  address text,
  notes text,
  created_at timestamp default now()
);

create table purchases (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  supplier text,
  weight decimal(10,3) not null,
  karat integer default 18,
  price_per_gram integer not null,
  total_price integer not null,
  wage integer default 0,
  notes text,
  created_at timestamp default now()
);

create table sales (
  id uuid default gen_random_uuid() primary key,
  invoice_number text unique,
  customer_id uuid references customers(id) on delete set null,
  customer_name text,
  date date not null,
  weight decimal(10,3) not null,
  karat integer default 18,
  price_per_gram integer not null,
  total_gold_price integer not null,
  wage integer default 0,
  tax integer default 0,
  total_price integer not null,
  buy_price_per_gram integer,
  profit integer,
  notes text,
  created_at timestamp default now()
);

create table banking (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  customer_id uuid references customers(id) on delete set null,
  customer_name text,
  weight decimal(10,3) not null,
  karat integer default 18,
  buy_price_per_gram integer not null,
  sell_price_per_gram integer not null,
  total_buy integer not null,
  total_sell integer not null,
  profit integer not null,
  notes text,
  created_at timestamp default now()
);

-- Allow public access (RLS disabled for simplicity - enable + add policies for production)
alter table customers enable row level security;
alter table purchases enable row level security;
alter table sales enable row level security;
alter table banking enable row level security;

-- Allow all operations (change to restricted policies if needed)
create policy "allow_all" on customers for all using (true) with check (true);
create policy "allow_all" on purchases for all using (true) with check (true);
create policy "allow_all" on sales for all using (true) with check (true);
create policy "allow_all" on banking for all using (true) with check (true);

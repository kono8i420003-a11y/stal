-- Таблица для хранения заявок на пробную тренировку и сообщений обратной связи
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('trial', 'feedback')),
  name text not null,
  phone text not null,
  age integer,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'read', 'replied', 'completed')),
  created_at timestamptz not null default now()
);

create index if not exists requests_type_idx on public.requests (type);
create index if not exists requests_created_at_idx on public.requests (created_at desc);

alter table public.requests enable row level security;

-- Запись и чтение разрешены только через сервисный ключ (server-side),
-- поэтому публичных policy для anon-роли не создаём.

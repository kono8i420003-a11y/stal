import { createClient } from '@supabase/supabase-js';

let client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!client) {
    client = createClient(url, key);
  }

  return client;
}

export interface RequestRecord {
  type: 'trial' | 'feedback';
  name: string;
  phone: string;
  age?: number | null;
  message?: string | null;
}

export async function saveRequest(record: RequestRecord) {
  const supabase = getSupabase();

  if (!supabase) {
    console.warn('⚠️ Supabase не настроен (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY отсутствуют).');
    return { saved: false };
  }

  const { error } = await supabase.from('requests').insert([
    {
      type: record.type,
      name: record.name,
      phone: record.phone,
      age: record.age ?? null,
      message: record.message ?? null,
      status: 'new',
    },
  ] as never);

  if (error) {
    console.error('Ошибка записи заявки в Supabase:', error);
    return { saved: false, error };
  }

  return { saved: true };
}

const RATE_LIMIT_WINDOW_SECONDS = 60;

export async function wasSubmittedRecently(phone: string): Promise<boolean> {
  const supabase = getSupabase();

  if (!supabase) {
    return false;
  }

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();

  const { data, error } = await supabase
    .from('requests')
    .select('id')
    .eq('phone', phone)
    .gte('created_at', since)
    .limit(1);

  if (error) {
    console.error('Ошибка проверки лимита частоты заявок:', error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

export interface StoredRequest {
  id: string;
  type: 'trial' | 'feedback';
  name: string;
  phone: string;
  age: number | null;
  message: string | null;
  status: string;
  created_at: string;
}

export async function listRequests(): Promise<StoredRequest[]> {
  const supabase = getSupabase();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Ошибка получения заявок из Supabase:', error);
    return [];
  }

  return (data ?? []) as unknown as StoredRequest[];
}

export async function updateRequestStatus(id: string, status: string) {
  const supabase = getSupabase();

  if (!supabase) {
    return { updated: false };
  }

  const { error } = await supabase.from('requests').update({ status } as never).eq('id', id);

  if (error) {
    console.error('Ошибка обновления статуса заявки:', error);
    return { updated: false, error };
  }

  return { updated: true };
}

export async function deleteRequest(id: string) {
  const supabase = getSupabase();

  if (!supabase) {
    return { deleted: false };
  }

  const { error } = await supabase.from('requests').delete().eq('id', id);

  if (error) {
    console.error('Ошибка удаления заявки:', error);
    return { deleted: false, error };
  }

  return { deleted: true };
}

export async function clearRequestsByType(type: 'trial' | 'feedback') {
  const supabase = getSupabase();

  if (!supabase) {
    return { cleared: false };
  }

  const { error } = await supabase.from('requests').delete().eq('type', type);

  if (error) {
    console.error('Ошибка очистки заявок:', error);
    return { cleared: false, error };
  }

  return { cleared: true };
}

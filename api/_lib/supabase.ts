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

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  listRequests,
  updateRequestStatus,
  deleteRequest,
  clearRequestsByType,
} from '../_lib/supabase.js';

function isAuthorized(req: VercelRequest): boolean {
  const secret = process.env.ADMIN_PANEL_SECRET;
  if (!secret) {
    return false;
  }
  return req.headers['x-admin-secret'] === secret;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Secret');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Неверный пароль администратора.' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const requests = await listRequests();
      res.json({ requests });
      return;
    }

    if (req.method === 'PATCH') {
      const { id, status } = req.body;
      if (!id || !status) {
        res.status(400).json({ error: 'Нужны id и status.' });
        return;
      }
      await updateRequestStatus(id, status);
      res.json({ status: 'ok' });
      return;
    }

    if (req.method === 'DELETE') {
      const { id, type } = req.query;
      if (id && typeof id === 'string') {
        await deleteRequest(id);
        res.json({ status: 'ok' });
        return;
      }
      if (type === 'trial' || type === 'feedback') {
        await clearRequestsByType(type);
        res.json({ status: 'ok' });
        return;
      }
      res.status(400).json({ error: 'Нужен id или type.' });
      return;
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('Error in admin/requests handler:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера.', details: error.message });
  }
}

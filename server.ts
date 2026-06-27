import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  saveRequest,
  wasSubmittedRecently,
  listRequests,
  updateRequestStatus,
  deleteRequest,
  clearRequestsByType,
} from './api/_lib/supabase';
import { escapeHtml } from './api/_lib/telegram';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

  // Log incoming API calls
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Secure API endpoint for Telegram Notifications
  app.post('/api/notify-telegram', async (req, res) => {
    try {
      const { source, name, phone, age, message, company } = req.body;

      // Honeypot field: real users never fill this hidden input, bots usually do.
      if (company) {
        res.json({ status: 'success', message: 'Заявка принята.' });
        return;
      }

      if (!name || !phone) {
         res.status(400).json({
          error: 'Пожалуйста, заполните необходимые поля: имя и телефон.'
        });
        return;
      }

      if (await wasSubmittedRecently(phone)) {
        res.status(429).json({
          error: 'Заявка с этим номером телефона уже отправлена. Пожалуйста, подождите минуту перед повторной отправкой.'
        });
        return;
      }

      await saveRequest({
        type: source === 'trial' ? 'trial' : 'feedback',
        name,
        phone,
        age: age ? Number(age) : null,
        message,
      });

      const token = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      // Handle unconfigured/missing environment variables gracefully
      if (!token || !chatId) {
        console.warn('⚠️ Telegram Bot Token or Chat ID is not configured in .env / secrets.');
        console.log('Новая заявка (БЕЗ ТЕЛЕГРАМА):', { source, name, phone, age, message });
        
         res.json({
          status: 'warning',
          message: 'Заявка сохранена локально. Желаете отправлять в Телеграм? Настройте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в панеле секретов.',
          data: { name, phone }
        });
        return;
      }

      // Format markdown-like Telegram notification text
      const heading = source === 'trial' ? '🔴 НОВАЯ ЗАЯВКА НА ПРОБНУЮ ТРЕНИРОВКУ' : '✉️ НОВОЕ СООБЩЕНИЕ ОБРАТНОЙ СВЯЗИ';
      let text = `<b>${heading}</b>\n\n`;
      text += `<b>👤 Имя:</b> ${escapeHtml(name)}\n`;
      text += `<b>📞 Телефон:</b> ${escapeHtml(phone)}\n`;
      text += `<b>🎂 Возраст ученика:</b> ${age ? escapeHtml(String(age)) : 'Не указан'}\n`;

      if (message) {
        text += `<b>💬 Сообщение:</b> \n<i>${escapeHtml(message)}</i>\n`;
      }
      
      text += `\n<i>Школа СТАЛЬ © ${new Date().getFullYear()}</i>`;

      // Call official Telegram Bot API via standard server-side fetch
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      });

      const resData = await response.json() as any;

      if (!response.ok || !resData.ok) {
        console.error('Telegram API error response:', resData);
        throw new Error(resData.description || 'Не удалось отправить сообщение через Telegram API.');
      }

      console.log('✅ Уведомление успешно отправлено в Телеграм!');
      res.json({
        status: 'success',
        message: 'Уведомление отправлено в Телеграм-бот!'
      });

    } catch (error: any) {
      console.error('Error sending Telegram notification:', error);
      res.status(500).json({
        error: 'Внутренняя ошибка сервера при отправке уведомления в Telegram.',
        details: error.message
      });
    }
  });

  // Admin panel API: read/update/delete requests stored in Supabase
  const requireAdminSecret = (req: express.Request, res: express.Response): boolean => {
    const secret = process.env.ADMIN_PANEL_SECRET;
    if (!secret || req.headers['x-admin-secret'] !== secret) {
      res.status(401).json({ error: 'Неверный пароль администратора.' });
      return false;
    }
    return true;
  };

  app.get('/api/admin/requests', async (req, res) => {
    if (!requireAdminSecret(req, res)) return;
    const requests = await listRequests();
    res.json({ requests });
  });

  app.patch('/api/admin/requests', async (req, res) => {
    if (!requireAdminSecret(req, res)) return;
    const { id, status } = req.body;
    if (!id || !status) {
      res.status(400).json({ error: 'Нужны id и status.' });
      return;
    }
    await updateRequestStatus(id, status);
    res.json({ status: 'ok' });
  });

  app.delete('/api/admin/requests', async (req, res) => {
    if (!requireAdminSecret(req, res)) return;
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
  });

  // Vite development vs production serving strategy
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Full-Stack] Server booted on http://localhost:${PORT}`);
  });
}

startServer();

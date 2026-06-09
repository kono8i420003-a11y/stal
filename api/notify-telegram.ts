import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { source, name, phone, age, message } = req.body;

    if (!name || !phone) {
      res.status(400).json({ 
        error: 'Пожалуйста, заполните необходимые поля: имя и телефон.' 
      });
      return;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('⚠️ Telegram Bot Token or Chat ID is not configured.');
      res.json({
        status: 'warning',
        message: 'Заявка сохранена локально (на сервере Vercel). Пожалуйста, настройте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в переменных окружения Vercel.',
        data: { name, phone }
      });
      return;
    }

    const heading = source === 'trial' ? '🔴 НОВАЯ ЗАЯВКА НА ПРОБНУЮ ТРЕНИРОВКУ' : '✉️ НОВОЕ СООБЩЕНИЕ ОБРАТНОЙ СВЯЗИ';
    let text = `<b>${heading}</b>\n\n`;
    text += `<b>👤 Имя:</b> ${name}\n`;
    text += `<b>📞 Телефон:</b> ${phone}\n`;
    text += `<b>🎂 Возраст ученика:</b> ${age || 'Не указан'}\n`;
    
    if (message) {
      text += `<b>💬 Сообщение:</b> \n<i>${message}</i>\n`;
    }
    
    text += `\n<i>Школа СТАЛЬ © ${new Date().getFullYear()}</i>`;

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
      console.error('Telegram API error:', resData);
      throw new Error(resData.description || 'Ошибка Telegram API');
    }

    res.json({
      status: 'success',
      message: 'Уведомление успешно доставлено!'
    });

  } catch (error: any) {
    console.error('Error in notify-telegram handler:', error);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера Vercel.',
      details: error.message
    });
  }
}

import dotenv from 'dotenv';

// Load env variables
dotenv.config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function executeTests() {
  console.log('🏁 Запуск тестов интеграции с Telegram API...\n');
  
  if (!TOKEN || !CHAT_ID) {
    console.error('❌ ОШИБКА: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы в файле .env');
    process.exit(1);
  }

  // ==== ТЕСТ 1: Положительный тест (Отправка тестового сообщения) ====
  console.log('🧪 ТЕСТ 1 [Положительный]: Отправка успешного сообщения...');
  try {
    const text = '🎯 <b>Школа СТАЛЬ: Тест Интеграции</b>\n\n✅ Положительный тест выполнен успешно! Сообщение отправлено из тестового скрипта.';
    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json() as any;
    if (response.ok && data.ok) {
      console.log('✅ ТЕСТ 1 пройден! Сообщение доставлено в Telegram бот.');
    } else {
      console.error('❌ ТЕСТ 1 провален!', data);
    }
  } catch (error: any) {
    console.error('❌ ТЕСТ 1 провален с исключением:', error.message);
  }

  console.log('\n----------------------------------------\n');

  // ==== ТЕСТ 2: Негативный тест (Использование невалидного токена) ====
  console.log('🧪 ТЕСТ 2 [Негативный]: Проверка обработки неверного Токена...');
  try {
    const badToken = '123456:InvalidTokenPlaceholder';
    const response = await fetch(`https://api.telegram.org/bot${badToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: 'Тест',
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json() as any;
    if (!response.ok || !data.ok) {
      console.log(`✅ ТЕСТ 2 пройден! Система безопасности корректно отклонила неверный токен: "${data.description}"`);
    } else {
      console.error('❌ ТЕСТ 2 провален! Telegram API принял недействительный токен (такого быть не должно).');
    }
  } catch (error: any) {
    console.error('❌ Исключение в ТЕСТ 2:', error.message);
  }

  console.log('\n----------------------------------------\n');

  // ==== ТЕСТ 3: Негативный тест (Использование невалидного Chat ID) ====
  console.log('🧪 ТЕСТ 3 [Негативный]: Проверка обработки неверного Chat ID...');
  try {
    const badChatId = '9999999999999'; // Invalid ID format
    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: badChatId,
        text: 'Тест',
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json() as any;
    if (!response.ok || !data.ok) {
      console.log(`✅ ТЕСТ 3 пройден! Система безопасности корректно отклонила неверный Chat ID: "${data.description}"`);
    } else {
      console.error('❌ ТЕСТ 3 провален! Telegram API принял неверный Chat ID.');
    }
  } catch (error: any) {
    console.error('❌ Исключение в ТЕСТ 3:', error.message);
  }

  console.log('\n🏁 Все авто-тесты завершены!');
}

executeTests();

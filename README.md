# СТАЛЬ — лендинг школы рукопашного боя

Лендинг для школы рукопашного боя «СТАЛЬ» (г. Ставрополь). Собирает заявки на пробную тренировку и сообщения обратной связи, уведомляет администратора в Telegram и сохраняет лиды в базе данных.

## Демо

- Сайт (Vercel): https://stal-seven.vercel.app
- Telegram-бот: уведомления приходят владельцу школы при каждой заявке
- Данные: Supabase, таблица `requests`

## Функциональность

- Лендинг с формами (валидация, статусы отправки, адаптивная вёрстка под мобильные устройства)
- Сохранение каждой заявки/сообщения в Supabase (`requests`)
- Уведомление администратора в Telegram при новой заявке (HTML-экранирование пользовательского ввода)
- Honeypot-поле и rate-limit (60 сек на номер телефона) против спам-ботов
- Админ-панель «ЦУП «СТАЛЬ»» (защищена паролем) — просмотр, изменение статуса и удаление заявок прямо из Supabase

## Как это работает

```
Пользователь → форма на сайте → /api/notify-telegram
                                       ├─→ Supabase (таблица requests)
                                       └─→ Telegram Bot API (уведомление)

Администратор → /api/admin/requests (X-Admin-Secret) → Supabase
```

## Технологии

- React + Vite + Tailwind CSS — фронтенд
- Express (`server.ts`) — локальный dev-сервер
- Vercel Serverless Functions (`api/`) — продакшен backend
- Supabase — хранение заявок
- Telegram Bot API — уведомления

## Структура репозитория

```
/README.md
/.env.example
/api/
  notify-telegram.ts      — приём заявок, запись в Supabase, отправка в Telegram
  admin/requests.ts       — защищённый эндпоинт для админ-панели
  _lib/supabase.ts        — клиент Supabase и операции с таблицей requests
  _lib/telegram.ts        — экранирование HTML для Telegram-сообщений
/src/
  components/             — секции лендинга и админ-панель
  data.ts, App.tsx         — контент и сборка страницы
/supabase/migrations/      — SQL-миграция таблицы requests
/scripts/optimize-images.mjs — конвертация изображений в WebP
/server.ts                 — локальный dev-сервер (Express + Vite)
```

## Локальный запуск

```bash
cp .env.example .env
# заполнить переменные ниже
npm install
npm run dev
```

## Переменные окружения

```
TELEGRAM_BOT_TOKEN=        # токен бота из @BotFather
TELEGRAM_CHAT_ID=          # chat_id для уведомлений
SUPABASE_URL=              # URL проекта Supabase
SUPABASE_SERVICE_ROLE_KEY= # service role key (только сервер!)
ADMIN_PANEL_SECRET=        # пароль для админ-панели
```

## Безопасность

- `.env` не коммитится (`.gitignore`), в репозитории есть только `.env.example`
- `SUPABASE_SERVICE_ROLE_KEY` используется исключительно на сервере (Vercel functions / Express), никогда во фронтенде
- В Supabase включён Row Level Security; публичных policy нет — запись/чтение только через service role key
- Пользовательский ввод экранируется перед вставкой в HTML-сообщения Telegram
- Админ-эндпоинт защищён секретным паролем (`ADMIN_PANEL_SECRET`)

## Проверка (QA)

- **Позитивный кейс**: корректные имя/телефон/возраст → заявка сохраняется в Supabase, уведомление приходит в Telegram
- **Негативный кейс**: пустое имя, некорректный телефон/возраст → форма показывает ошибку, запрос не отправляется
- **Антиспам**: скрытое honeypot-поле и повторная отправка с тем же номером телефона быстрее чем через 60 секунд отклоняются сервером

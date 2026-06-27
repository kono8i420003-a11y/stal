import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { X, Trophy, MessageSquare, PhoneCall, Trash2, ShieldAlert, Check, RefreshCw } from 'lucide-react';

interface AdminRequest {
  id: string;
  type: 'trial' | 'feedback';
  name: string;
  phone: string;
  age: number | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface LeadDashboardProps {
  onClose: () => void;
  onDataChanged: () => void;
}

const SECRET_STORAGE_KEY = 'stal_admin_secret';

export default function LeadDashboard({ onClose, onDataChanged }: LeadDashboardProps) {
  const [activeTab, setActiveTab] = useState<'trials' | 'feedback'>('trials');
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const trials = requests.filter(r => r.type === 'trial');
  const feedbacks = requests.filter(r => r.type === 'feedback');

  const fetchData = useCallback(async (secret: string) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/requests', {
        headers: { 'X-Admin-Secret': secret },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(SECRET_STORAGE_KEY);
        setAuthError('Неверный пароль администратора.');
        setRequests([]);
        return;
      }
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch (e) {
      console.error('Не удалось загрузить заявки:', e);
      setAuthError('Не удалось загрузить заявки. Проверьте соединение.');
    } finally {
      setLoading(false);
    }
  }, []);

  const ensureSecretAndLoad = useCallback(() => {
    let secret = sessionStorage.getItem(SECRET_STORAGE_KEY);
    if (!secret) {
      secret = prompt('Введите пароль администратора:') || '';
      if (!secret) {
        setAuthError('Пароль администратора не введён.');
        return;
      }
      sessionStorage.setItem(SECRET_STORAGE_KEY, secret);
    }
    fetchData(secret);
  }, [fetchData]);

  useEffect(() => {
    ensureSecretAndLoad();
  }, [ensureSecretAndLoad]);

  const withSecret = async (run: (secret: string) => Promise<Response>) => {
    const secret = sessionStorage.getItem(SECRET_STORAGE_KEY);
    if (!secret) {
      ensureSecretAndLoad();
      return;
    }
    const res = await run(secret);
    if (res.status === 401) {
      sessionStorage.removeItem(SECRET_STORAGE_KEY);
      setAuthError('Неверный пароль администратора.');
      return;
    }
    await fetchData(secret);
    onDataChanged();
  };

  const handleClearAll = () => {
    if (!confirm('Вы уверены, что хотите очистить всю базу заявок этой категории?')) return;
    const type = activeTab === 'trials' ? 'trial' : 'feedback';
    withSecret(secret =>
      fetch(`/api/admin/requests?type=${type}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Secret': secret },
      })
    );
  };

  const handleDelete = (id: string) => {
    withSecret(secret =>
      fetch(`/api/admin/requests?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Secret': secret },
      })
    );
  };

  const handleToggleStatus = (req: AdminRequest) => {
    const nextStatus =
      req.type === 'trial'
        ? req.status === 'new' ? 'completed' : 'new'
        : req.status === 'unread' ? 'read' : 'unread';

    withSecret(secret =>
      fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'X-Admin-Secret': secret, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: req.id, status: nextStatus }),
      })
    );
  };

  return (
    <div id="leads_admin_dashboard" className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity">

      {/* Tap out zone on left to close */}
      <div className="flex-grow" onClick={onClose} />

      {/* Main Panel Content Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-w-xl bg-zinc-950 border-l border-zinc-900 h-full flex flex-col shadow-2xl relative"
      >
        {/* Panel Header */}
        <div className="p-6 border-b border-zinc-950 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950/40 text-red-500 rounded">
              <ShieldAlert size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold tracking-wider text-white uppercase">ЦУП «СТАЛЬ»</h3>
              <p className="text-[10px] text-zinc-500 font-mono">ПАНЕЛЬ УПРАВЛЕНИЯ ЗАЯВКАМИ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-zinc-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-950 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('trials')}
              className={`px-4 py-2 rounded-sm text-xs font-semibold tracking-wider font-display uppercase transition-colors flex items-center gap-2 ${
                activeTab === 'trials'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <PhoneCall size={14} />
              <span>Пробные ({trials.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-4 py-2 rounded-sm text-xs font-semibold tracking-wider font-display uppercase transition-colors flex items-center gap-2 ${
                activeTab === 'feedback'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <MessageSquare size={14} />
              <span>Вопросы ({feedbacks.length})</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={ensureSecretAndLoad}
              className="p-1.5 px-2.5 bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 rounded text-xs flex items-center gap-1.5"
              title="Обновить данные"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>Обновить</span>
            </button>

            {(activeTab === 'trials' ? trials.length : feedbacks.length) > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1.5 px-2.5 bg-zinc-900 text-zinc-400 hover:text-red-500 border border-zinc-800 rounded text-xs"
              >
                Очистить
              </button>
            )}
          </div>
        </div>

        {/* Scrollable list content */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">

          {authError && (
            <div className="text-center py-16 text-red-500">
              <Trophy size={44} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium text-sm">{authError}</p>
              <button
                onClick={ensureSecretAndLoad}
                className="mt-4 text-xs underline text-zinc-400 hover:text-white"
              >
                Попробовать снова
              </button>
            </div>
          )}

          {!authError && activeTab === 'trials' && (
            <div className="space-y-4" id="admin_trials_list">
              {trials.length === 0 ? (
                <div className="text-center py-16 text-zinc-600">
                  <PhoneCall size={44} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-sm">Новых заявок на пробные занятия нет</p>
                </div>
              ) : (
                trials.map(trial => (
                  <div
                    key={trial.id}
                    id={`admin_trial_item_${trial.id}`}
                    className={`bg-zinc-900/50 border rounded p-5 transition-all ${
                      trial.status === 'new' ? 'border-red-600/30 bg-red-950/5' : 'border-zinc-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-display font-bold text-white text-base uppercase leading-snug">
                          {trial.name}
                        </h4>
                        <span className="text-zinc-500 text-[10px] font-mono leading-none">
                          {new Date(trial.created_at).toLocaleString('ru-RU')}
                        </span>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleStatus(trial)}
                          className={`p-1.5 rounded transition-colors ${
                            trial.status === 'new'
                              ? 'bg-zinc-800 text-zinc-400 hover:text-green-500'
                              : 'bg-green-950/40 text-green-500 hover:bg-zinc-800'
                          }`}
                          title={trial.status === 'new' ? 'Отметить как решено' : 'Вернуть в новые'}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(trial.id)}
                          className="p-1.5 bg-zinc-800 text-zinc-500 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900/85">
                      <div>
                        <span className="text-[10px] text-zinc-600 font-mono block">ТЕЛЕФОН</span>
                        <a href={`tel:${trial.phone}`} className="text-zinc-300 text-sm font-semibold hover:text-red-500 transition-colors">
                          {trial.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-600 font-mono block">ВОЗРАСТ УЧЕНИКА</span>
                        <span className="text-zinc-300 text-sm font-semibold">{trial.age ?? '—'} лет</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!authError && activeTab === 'feedback' && (
            <div className="space-y-4" id="admin_feeds_list">
              {feedbacks.length === 0 ? (
                <div className="text-center py-16 text-zinc-600">
                  <MessageSquare size={44} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-sm">Входящих вопросов и отзывов нет</p>
                </div>
              ) : (
                feedbacks.map(feed => (
                  <div
                    key={feed.id}
                    id={`admin_feed_item_${feed.id}`}
                    className={`bg-zinc-900/50 border rounded p-5 transition-all ${
                      feed.status === 'unread' ? 'border-red-600/30 bg-red-950/5' : 'border-zinc-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-display font-medium text-white text-base uppercase leading-snug">
                          {feed.name}
                        </h4>
                        <span className="text-zinc-500 text-[10px] font-mono leading-none">
                          {new Date(feed.created_at).toLocaleString('ru-RU')}
                        </span>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleStatus(feed)}
                          className={`p-1.5 rounded transition-colors ${
                            feed.status === 'unread'
                              ? 'bg-zinc-800 text-zinc-400 hover:text-green-500'
                              : 'bg-green-950/40 text-green-500 hover:bg-zinc-800'
                          }`}
                          title={feed.status === 'unread' ? 'Пометить прочитанным' : 'Пометить непрочитанным'}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(feed.id)}
                          className="p-1.5 bg-zinc-800 text-zinc-500 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-zinc-950 p-3.5 rounded-sm border border-zinc-900 mb-4">
                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line italic">
                        "{feed.message}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900/85">
                      <div>
                        <span className="text-[10px] text-zinc-600 font-mono block">КОНТАКТ</span>
                        <a href={`tel:${feed.phone}`} className="text-zinc-300 text-xs font-semibold hover:text-red-500 transition-colors block">
                          {feed.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-600 font-mono block">ВОЗРАСТ</span>
                        <span className="text-zinc-300 text-xs font-semibold">{feed.age ?? '—'} лет</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Persistent bottom metadata bar */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-950 text-center text-zinc-600 font-mono text-[9px]">
          Школа СТАЛЬ © 2026 · Данные хранятся в Supabase
        </div>
      </motion.div>
    </div>
  );
}

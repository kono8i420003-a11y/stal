import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Trophy, MessageSquare, PhoneCall, Trash2, Database, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { TrialRequest, FeedbackMessage } from '../types';

interface LeadDashboardProps {
  onClose: () => void;
  onDataChanged: () => void;
}

export default function LeadDashboard({ onClose, onDataChanged }: LeadDashboardProps) {
  const [activeTab, setActiveTab] = useState<'trials' | 'feedback'>('trials');
  const [trials, setTrials] = useState<TrialRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);

  // Reload data from local storage
  const reloadData = () => {
    const trialRaw = localStorage.getItem('stal_trial_requests');
    const feedRaw = localStorage.getItem('stal_feedback_messages');
    
    setTrials(trialRaw ? JSON.parse(trialRaw) : []);
    setFeedbacks(feedRaw ? JSON.parse(feedRaw) : []);
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleClearAll = () => {
    if (confirm('Вы уверены, что хотите очистить всю базу заявок?')) {
      if (activeTab === 'trials') {
        localStorage.removeItem('stal_trial_requests');
        setTrials([]);
      } else {
        localStorage.removeItem('stal_feedback_messages');
        setFeedbacks([]);
      }
      onDataChanged();
    }
  };

  const handleDeleteTrial = (id: string) => {
    const updated = trials.filter(t => t.id !== id);
    localStorage.setItem('stal_trial_requests', JSON.stringify(updated));
    setTrials(updated);
    onDataChanged();
  };

  const handleDeleteFeedback = (id: string) => {
    const updated = feedbacks.filter(f => f.id !== id);
    localStorage.setItem('stal_feedback_messages', JSON.stringify(updated));
    setFeedbacks(updated);
    onDataChanged();
  };

  // Seeding mock submissions for ease of testing
  const handleSeedData = () => {
    const sampleTrials: TrialRequest[] = [
      {
        id: 't-1',
        name: 'Алексей Смирнов',
        phone: '+7 (918) 745-12-88',
        studentAge: 27,
        submittedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        status: 'new'
      },
      {
        id: 't-2',
        name: 'София Кузнецова (сын Никита)',
        phone: '+7 (962) 441-99-31',
        studentAge: 9,
        submittedAt: new Date(Date.now() - 15000000).toISOString(), // 4h ago
        status: 'completed'
      }
    ];

    const sampleFeedbacks: FeedbackMessage[] = [
      {
        id: 'f-1',
        name: 'Владислав Павлов',
        phone: '+7 (905) 444-22-11',
        age: 33,
        message: 'Добрый день! Подскажите, есть ли вечерние группы ОФП по субботам? Спасибо!',
        submittedAt: new Date(Date.now() - 42 * 60000).toISOString(), // 42 min ago
        status: 'unread'
      },
      {
        id: 'f-2',
        name: 'Екатерина Романова',
        phone: '+7 (928) 331-55-90',
        age: 29,
        message: 'Отличный зал! Ребенок в восторге от тренера Игоря Климова. Очень профессиональный подход к деткам.',
        submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'read'
      }
    ];

    // Merge with key local storage and reset
    const savedTrials = localStorage.getItem('stal_trial_requests');
    const existingTrials: TrialRequest[] = savedTrials ? JSON.parse(savedTrials) : [];
    const mergedTrials = [...existingTrials];
    sampleTrials.forEach(st => {
      if (!mergedTrials.some(t => t.name === st.name)) {
        mergedTrials.push(st);
      }
    });

    const savedFeeds = localStorage.getItem('stal_feedback_messages');
    const existingFeeds: FeedbackMessage[] = savedFeeds ? JSON.parse(savedFeeds) : [];
    const mergedFeeds = [...existingFeeds];
    sampleFeedbacks.forEach(sf => {
      if (!mergedFeeds.some(f => f.name === sf.name)) {
        mergedFeeds.push(sf);
      }
    });

    localStorage.setItem('stal_trial_requests', JSON.stringify(mergedTrials));
    localStorage.setItem('stal_feedback_messages', JSON.stringify(mergedFeeds));
    
    reloadData();
    onDataChanged();
  };

  const handleToggleTrialStatus = (id: string) => {
    const updated = trials.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'new' ? 'completed' : 'new' } as TrialRequest;
      }
      return t;
    });
    localStorage.setItem('stal_trial_requests', JSON.stringify(updated));
    setTrials(updated);
  };

  const handleToggleFeedStatus = (id: string) => {
    const updated = feedbacks.map(f => {
      if (f.id === id) {
        return { ...f, status: f.status === 'unread' ? 'read' : 'unread' } as FeedbackMessage;
      }
      return f;
    });
    localStorage.setItem('stal_feedback_messages', JSON.stringify(updated));
    setFeedbacks(updated);
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
            {/* Seed mock button */}
            <button
              onClick={handleSeedData}
              className="px-2.5 py-1.5 text-[10px] bg-indigo-950/50 hover:bg-indigo-950 text-indigo-400 border border-indigo-900/60 font-mono tracking-wider uppercase rounded flex items-center gap-1.5"
              title="Заполнить демо-данными для проверки обратной связи"
            >
              <Sparkles size={11} />
              <span>Демо-тест</span>
            </button>

            {/* Clear All */}
            {(activeTab === 'trials' ? trials.length : feedbacks.length) > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1 px-2.5 bg-zinc-900 text-zinc-400 hover:text-red-500 border border-zinc-800 rounded text-xs"
              >
                Очистить
              </button>
            )}
          </div>
        </div>

        {/* Scrollable list content */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: TRIAL REGISTRATIONS */}
          {activeTab === 'trials' && (
            <div className="space-y-4" id="admin_trials_list">
              {trials.length === 0 ? (
                <div className="text-center py-16 text-zinc-600">
                  <PhoneCall size={44} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-sm">Новых заявок на пробные занятия нет</p>
                  <p className="text-xs text-zinc-600 mt-1">Оставьте заявку на сайте или воспользуйтесь кнопкой «Демо-тест»</p>
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
                          ID: {trial.id} · {new Date(trial.submittedAt).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleTrialStatus(trial.id)}
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
                          onClick={() => handleDeleteTrial(trial.id)}
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
                        <span className="text-zinc-300 text-sm font-semibold">{trial.studentAge} лет</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: QUESTIONS & FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="space-y-4" id="admin_feeds_list">
              {feedbacks.length === 0 ? (
                <div className="text-center py-16 text-zinc-600">
                  <MessageSquare size={44} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-sm">Входящих вопросов и отзывов нет</p>
                  <p className="text-xs text-zinc-600 mt-1">Оставьте сообщение через форму обратной связи на сайте</p>
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
                          {new Date(feed.submittedAt).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleFeedStatus(feed.id)}
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
                          onClick={() => handleDeleteFeedback(feed.id)}
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
                        <span className="text-zinc-300 text-xs font-semibold">{feed.age} лет</span>
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
          Школа СТАЛЬ © 2026 · Данные сохраняются локально в вашем браузере
        </div>
      </motion.div>
    </div>
  );
}

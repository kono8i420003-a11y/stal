import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Users, Shield, CheckCircle } from 'lucide-react';

interface TrialSectionProps {
  selectedProgram: string;
}

export default function TrialSection({ selectedProgram }: TrialSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [company, setCompany] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill age or contact based on selection signals
  useEffect(() => {
    if (selectedProgram) {
      // scroll to this form automatically
      const element = document.getElementById('trial-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Auto-set age hint depending on program selection
      if (selectedProgram === 'ДЕТИ') {
        setAge('10');
      } else if (selectedProgram === 'ВЗРОСЛЫЕ' || selectedProgram === 'БОЙЦЫ') {
        setAge('25');
      }
    }
  }, [selectedProgram]);

  // Phone masking function matching standard Russian format: +7 (XXX) XXX-XX-XX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Fallback if erasing
    if (input.length < phone.length && phone.endsWith('-') || phone.endsWith(') ') || phone.endsWith('(')) {
      setPhone(input);
      return;
    }

    const digits = input.replace(/\D/g, '');
    let raw = digits;
    
    // strip standard 7 or 8 prefix
    if (digits.startsWith('7') || digits.startsWith('8')) {
      raw = digits.substring(1);
    }
    
    // limit to 10 coordinates
    raw = raw.substring(0, 10);
    
    let formatted = '+7';
    if (raw.length > 0) {
      formatted += ' (' + raw.substring(0, 3);
    }
    if (raw.length >= 4) {
      formatted += ') ' + raw.substring(3, 6);
    }
    if (raw.length >= 7) {
      formatted += '-' + raw.substring(6, 8);
    }
    if (raw.length >= 9) {
      formatted += '-' + raw.substring(8, 10);
    }

    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Honeypot: bots tend to fill every input, real users never see this field.
    if (company.trim()) {
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Пожалуйста, введите ваше имя');
      return;
    }
    
    const digitsCount = phone.replace(/\D/g, '').length;
    // +7 plus 10 digits is 11 digits total 
    if (digitsCount < 11) {
      setErrorMsg('Пожалуйста, введите корректный номер телефона');
      return;
    }

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 4 || ageNum > 90) {
      setErrorMsg('Пожалуйста, укажите корректный возраст (от 4 до 90 лет)');
      return;
    }

    // Asynchronously send to telegram proxy server API (also persists the lead in Supabase)
    fetch('/api/notify-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'trial',
        name: name.trim(),
        phone: phone,
        age: ageNum,
        message: 'Хочет записаться на пробную бесплатную тренировку',
        company
      })
    })
    .then(res => res.json())
    .then(data => console.log('Telegram API Server Response:', data))
    .catch(err => console.error('Telegram notification fetch failed:', err));

    // Clear state
    setName('');
    setPhone('');
    setAge('');
    setIsSuccess(true);
    setErrorMsg('');

    // Reset success banner after 5 sec
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <section 
      id="trial-section" 
      className="py-24 bg-[#08080a] border-b border-zinc-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column (Key Benefits & Information) */}
          <div className="lg:col-span-7" id="trial_left_info">
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase font-semibold mb-3 block">
              ПРОБНОЕ ЗАНЯТИЕ
            </span>
            
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase">
              ПРИХОДИ. <span className="text-red-600">БЕСПЛАТНО.</span>
            </h2>
            
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
              Попробуй тренировку без обязательств. Познакомься с тренером, посмотри зал, почувствуй атмосферу. Без оплаты и регистрации.
            </p>

            {/* List of benefits matching Screenshot 1 */}
            <div className="space-y-6" id="trial_benefits_checklist">
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-red-950/40 border border-red-900/30 flex items-center justify-center text-red-500">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-semibold block text-white">60 минут полноценной тренировки</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-red-950/40 border border-red-900/30 flex items-center justify-center text-red-500">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-semibold block text-white">Группа до 12 человек</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-red-950/40 border border-red-900/30 flex items-center justify-center text-red-500">
                  <Shield size={20} />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-semibold block text-white">Все необходимое предоставим</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Lead Form Form) */}
          <div className="lg:col-span-5" id="trial_form_wrapper">
            <div className="bg-zinc-950 border border-zinc-900 p-8 sm:p-10 rounded-sm relative">
              
              {/* Inner ambient glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

              <span className="text-zinc-500 text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-1 block">
                Оставьте заявку — перезвоним в течение 15 минут
              </span>
              
              <h3 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-white mb-6 uppercase">
                ТРЕНИРОВКУ
              </h3>

              {/* Status / Notifications */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    internal-id="trial_success_notif"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-950/30 border border-red-900/40 p-6 rounded-sm text-center my-6"
                  >
                    <CheckCircle className="text-red-500 mx-auto mb-3" size={40} />
                    <h4 className="text-white font-bold text-base mb-1">Заявка успешно отправлена!</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Мы зарезервировали место на пробном занятии. Тренер свяжется с вами по указанному телефону в течение 15 минут!
                    </p>
                  </motion.div>
                ) : (
                  <div id="trial_form_content">
                    <form onSubmit={handleSubmit} className="space-y-5">

                      {/* Honeypot field: hidden from real users, catches bots */}
                      <input
                        type="text"
                        name="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="absolute opacity-0 pointer-events-none w-0 h-0"
                      />

                      {/* Name input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Имя</label>
                        <input
                          id="trial_input_name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Иван"
                          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-red-600 focus:outline-none text-white text-sm px-4 py-3 rounded-sm transition-colors"
                        />
                      </div>

                      {/* Phone and Student Age Inputs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Телефон</label>
                          <input
                            id="trial_input_phone"
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="+7 (___) ___-__-__"
                            className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-red-600 focus:outline-none text-white text-sm px-4 py-3 rounded-sm font-mono transition-colors"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Возраст ученика</label>
                          <input
                            id="trial_input_age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="18"
                            min="4"
                            max="90"
                            className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-red-600 focus:outline-none text-white text-sm px-4 py-3 rounded-sm font-mono transition-colors"
                          />
                        </div>
                      </div>

                      {/* Error State Banner */}
                      {errorMsg && (
                        <div id="trial_error_msg" className="text-red-500 text-xs font-semibold bg-red-950/20 border border-red-900/20 p-3 rounded-sm text-center">
                          {errorMsg}
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        id="trial_submit_btn"
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-display font-bold tracking-widest text-sm py-4 px-4 rounded-sm uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)]"
                      >
                        ЗАПИСАТЬСЯ
                      </button>

                      {/* Legal compliance text */}
                      <p className="text-[10px] text-zinc-500 text-center leading-relaxed mt-4">
                        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
                      </p>
                    </form>
                  </div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { CONTACT_INFO } from '../data';

export default function ContactsSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [comment, setComment] = useState('');
  const [company, setCompany] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dual phone masking logic
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    if (input.length < phone.length && phone.endsWith('-') || phone.endsWith(') ') || phone.endsWith('(')) {
      setPhone(input);
      return;
    }

    const digits = input.replace(/\D/g, '');
    let raw = digits;
    if (digits.startsWith('7') || digits.startsWith('8')) {
      raw = digits.substring(1);
    }
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
    if (digitsCount < 11) {
      setErrorMsg('Пожалуйста, укажите корректный телефон');
      return;
    }

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 4 || ageNum > 90) {
      setErrorMsg('Пожалуйста, укажите корректный возраст');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('Пожалуйста, введите текст сообщения или отзыва');
      return;
    }

    // Asynchronously send to telegram proxy server API (also persists the message in Supabase)
    fetch('/api/notify-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'feedback',
        name: name.trim(),
        phone: phone,
        age: ageNum,
        message: comment.trim(),
        company
      })
    })
    .then(res => res.json())
    .then(data => console.log('Telegram API Server Response:', data))
    .catch(err => console.error('Telegram notification fetch failed:', err));

    // Reset input states
    setName('');
    setPhone('');
    setAge('');
    setComment('');
    setIsSuccess(true);
    setErrorMsg('');

    // Reset banner after 5 sec
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <section 
      id="contacts" 
      className="py-24 bg-[#0a0a0c] overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column (Contacts Info Map & details) */}
          <div className="lg:col-span-6" id="contacts_info_panel">
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase font-semibold mb-3 block">
              КОНТАКТЫ
            </span>
            
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase">
              НАЙДИ НАС
            </h2>
            
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed mb-12 max-w-md">
              Есть вопрос? Напиши — ответим в течение дня. Вы также можете позвонить нам или навестить нас в зале в часы работы.
            </p>

            {/* List details matching Screenshot 1 */}
            <div className="space-y-8" id="contacts_details_grid">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-zinc-950 border border-zinc-900/60 flex items-center justify-center text-red-600 font-bold shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] sm:text-xs font-mono tracking-widest uppercase block mb-1">АДРЕС</span>
                  <span className="text-white text-sm sm:text-base font-semibold">{CONTACT_INFO.address}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-zinc-950 border border-zinc-900/60 flex items-center justify-center text-red-600 font-bold shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] sm:text-xs font-mono tracking-widest uppercase block mb-1">ТЕЛЕФОН</span>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="text-white text-sm sm:text-base font-semibold hover:text-red-500 transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-zinc-950 border border-zinc-900/60 flex items-center justify-center text-red-600 font-bold shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] sm:text-xs font-mono tracking-widest uppercase block mb-1">ПОЧТА</span>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-white text-sm sm:text-base font-semibold hover:text-red-500 transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              {/* Schedule */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-zinc-950 border border-zinc-900/60 flex items-center justify-center text-red-600 font-bold shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] sm:text-xs font-mono tracking-widest uppercase block mb-1">РАСПИСАНИЕ</span>
                  <span className="text-white text-sm sm:text-base font-semibold">{CONTACT_INFO.schedule}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Feedback Form Card) */}
          <div className="lg:col-span-6" id="feedback_form_panel">
            <div className="bg-zinc-950 border border-zinc-900 p-8 sm:p-10 rounded-sm relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

              <h3 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-white mb-1 uppercase">
                ОБРАТНАЯ СВЯЗЬ
              </h3>
              <p className="text-zinc-500 text-xs sm:text-sm font-medium mb-6">
                Задайте вопрос или оставьте отзыв
              </p>

              {/* Notification Screen State */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    internal-id="feedback_success_notif"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-950/30 border border-red-900/40 p-6 rounded-sm text-center my-6"
                  >
                    <CheckCircle className="text-red-500 mx-auto mb-3" size={40} />
                    <h4 className="text-white font-bold text-base mb-1">Ваше сообщение отправлено!</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Благодарим за обратную связь! Дежурный администратор школы ответит вам по телефону или электронной почте в течение дня.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" id="contacts_feedback_inner_form">

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
                        id="feedback_input_name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Иван"
                        className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-red-600 focus:outline-none text-white text-sm px-4 py-3 rounded-sm transition-colors"
                      />
                    </div>

                    {/* Phone and Age inputs in 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Телефон</label>
                        <input
                          id="feedback_input_phone"
                          type="tel"
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="+7 (___) ___-__-__"
                          className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-red-600 focus:outline-none text-white text-sm px-4 py-3 rounded-sm font-mono transition-colors"
                        />
                      </div>

                      {/* Age */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Возраст</label>
                        <input
                          id="feedback_input_age"
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

                    {/* Text Message Textarea with placeholder */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Сообщение</label>
                      <textarea
                        id="feedback_input_message"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Ваш вопрос или отзыв"
                        rows={4}
                        className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-red-600 focus:outline-none text-white text-sm px-4 py-3 rounded-sm transition-colors resize-none"
                      />
                    </div>

                    {/* Local validation warning */}
                    {errorMsg && (
                      <div id="feedback_error_banner" className="text-red-500 text-xs font-semibold bg-red-950/20 border border-red-900/20 p-3 rounded-sm text-center">
                        {errorMsg}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      id="feedback_submit_btn"
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-display font-medium tracking-widest text-sm py-4 px-4 rounded-sm uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)]"
                    >
                      ОТПРАВИТЬ СВЯЗЬ
                    </button>

                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

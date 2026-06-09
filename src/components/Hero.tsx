import { motion } from 'motion/react';
import { STATS } from '../data';
// @ts-ignore
import heroBg from '../assets/images/hero_background_1780984298970.png';

interface HeroProps {
  onTrialClick: () => void;
  onProgramsClick: () => void;
}

export default function Hero({ onTrialClick, onProgramsClick }: HeroProps) {
  return (
    <section 
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-black pt-24 overflow-hidden"
    >
      {/* Background Image with custom Red-Dark Overlays matching screenshot 4 */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Martial Arts Sparring"
          className="w-full h-full object-cover object-center opacity-45 scale-100 filter contrast-125 saturate-100 brightness-90 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Dark radial gradient overlay for focus and contrast */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(12,12,14,0.1)_0%,rgba(12,12,14,0.95)_100%]" />
        {/* Subtle red color tint split overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-transparent to-black/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24">
        <div className="max-w-3xl">
          {/* Badge Location & Founding Year */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-red-950/70 border border-red-800/40 px-4 py-1.5 rounded-full mb-6"
            id="hero_badge"
          >
            <span className="text-red-500 text-xs sm:text-sm font-semibold tracking-wider uppercase font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              СТАВРОПОЛЬ · С 2014 ГОДА
            </span>
          </motion.div>

          {/* Headline: СТАНЬ СИЛЬНЕЕ ЧЕМ ВЧЕРА */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight mb-6"
            id="hero_title"
          >
            СТАНЬ <span className="text-red-600">СИЛЬНЕЕ</span> <br />
            ЧЕМ ВЧЕРА
          </motion.h1>

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed mb-10 max-w-2xl"
            id="hero_desc"
          >
            Школа рукопашного боя «СТАЛЬ» — реальные навыки самообороны, бойцовский характер и железная физподготовка. 
            Для детей от 6 лет и взрослых без ограничений.
          </motion.p>

          {/* Call to Active CTAs buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-16"
            id="hero_ctas"
          >
            <button
              id="hero_cta_trial"
              onClick={onTrialClick}
              className="bg-red-600 hover:bg-red-700 text-white font-display font-bold tracking-wider text-sm px-8 py-4 rounded-sm uppercase transition-all duration-300 text-center hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] active:scale-95"
            >
              БЕСПЛАТНАЯ ТРЕНИРОВКА
            </button>
            <button
              id="hero_cta_programs"
              onClick={onProgramsClick}
              className="border-2 border-red-600/60 hover:border-red-600 hover:bg-red-600/10 text-white font-display font-medium tracking-wider text-sm px-8 py-3.5 rounded-sm uppercase transition-all duration-300 text-center active:scale-95"
            >
              ПРОГРАММЫ
            </button>
          </motion.div>

          {/* Real stats at the bottom of hero matching Screenshot 4 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl border-t border-zinc-900 pt-8"
            id="hero_stats"
          >
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col" id={`stat_${idx}`}>
                <span className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-widest leading-none">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs text-zinc-500 font-mono tracking-wider mt-1.5 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

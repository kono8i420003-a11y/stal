import { motion } from 'motion/react';
import { Shield, Target, Users, Trophy } from 'lucide-react';
import { ABOUT_BULLETS, BENEFIT_CARDS } from '../data';

const iconMap = {
  shield: Shield,
  target: Target,
  users: Users,
  trophy: Trophy
};

export default function About() {
  return (
    <section 
      id="about" 
      className="py-24 bg-[#0a0a0c] border-b border-zinc-900 overflow-hidden relative"
    >
      {/* Decorative vertical lines or grid dots for sport/martial vibe */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start">
          
          {/* Left Column Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            id="about_left"
          >
            {/* Category Tag */}
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase font-semibold mb-3 block">
              О ШКОЛЕ
            </span>
            
            {/* Main Headline */}
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 uppercase">
              НЕ СПОРТ. <span className="text-red-600">ОБРАЗ ЖИЗНИ.</span>
            </h2>
            
            {/* Supporting Paragraph */}
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-8">
              Мы не учим красивым движениям ради картинки. Мы готовим людей, которые умеют постоять за себя и своих близких в любой ситуации. Жёсткая дисциплина, честные спарринги и тренеры с боевым опытом.
            </p>
            
            {/* Bullet list with custom red square elements */}
            <ul className="space-y-4" id="about_bullets_list">
              {ABOUT_BULLETS.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-zinc-300" id={`about_bullet_${idx}`}>
                  <span className="mt-2 w-1.5 h-1.5 bg-red-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-snug">{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column Grid (2x2 Features) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            id="about_features_grid"
          >
            {BENEFIT_CARDS.map((card, idx) => {
              const IconComp = iconMap[card.iconName];
              return (
                <div
                  key={idx}
                  id={`benefit_card_${idx}`}
                  className="bg-zinc-950 border border-zinc-900 hover:border-red-600/30 p-6 sm:p-8 rounded-sm group transition-all duration-300 hover:bg-zinc-900/45 hover:-translate-y-1 block"
                >
                  <div className="text-red-600 mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
                    <IconComp size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold tracking-wider text-white mb-2 uppercase">
                    {card.title}
                  </h3>
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {card.subtitle}
                  </p>
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

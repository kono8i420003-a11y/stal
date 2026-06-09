import { motion } from 'motion/react';
import { TRAINERS } from '../data';

export default function Trainers() {
  return (
    <section 
      id="trainers" 
      className="py-24 bg-[#0a0a0c] border-b border-zinc-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="mb-16" id="trainers_heading">
          <span className="text-red-500 font-mono text-xs tracking-widest uppercase font-semibold mb-3 block">
            ТРЕНЕРЫ
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            ТЕ, КТО ПОВЕДЁТ ТЕБЯ
          </h2>
        </div>

        {/* Trainers Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="trainers_items_grid">
          {TRAINERS.map((trainer, idx) => (
            <motion.div
              key={idx}
              id={`trainer_card_${idx}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex flex-col group"
            >
              {/* Premium Card Image / Coach Portrait */}
              <div className="aspect-[4/5] bg-zinc-950 border border-zinc-900 group-hover:border-red-600/30 w-full mb-6 flex items-center justify-center relative overflow-hidden transition-all duration-300" id={`trainer_img_container_${idx}`}>
                {trainer.image ? (
                  <img
                    id={`trainer_avatar_img_${idx}`}
                    src={trainer.image}
                    alt={trainer.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  /* Initials center visual */
                  <span className="font-display text-7xl sm:text-8xl font-black tracking-widest text-[#2d1b1a] group-hover:text-[#4d2422] transition-colors duration-300 select-none">
                    {trainer.initials}
                  </span>
                )}
                
                {/* Accent red shadow/tint background */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                
                {/* Subtle border lines inside */}
                <div className="absolute inset-4 border border-zinc-900/40 pointer-events-none group-hover:border-red-600/20 transition-colors duration-300" />
              </div>

              {/* Trainer Details Column */}
              <h3 className="font-display text-xl sm:text-2xl font-black tracking-wider text-white mb-1 uppercase group-hover:text-red-500 transition-colors duration-200">
                {trainer.name}
              </h3>
              
              <span className="text-red-600 font-mono text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 block">
                {trainer.role}
              </span>
              
              <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors duration-200">
                {trainer.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

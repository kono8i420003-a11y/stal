import { motion } from 'motion/react';
import { PROGRAMS } from '../data';

interface ProgramsProps {
  onSelectProgram: (programName: string) => void;
}

export default function Programs({ onSelectProgram }: ProgramsProps) {
  return (
    <section 
      id="programs" 
      className="py-24 bg-[#08080a] border-b border-zinc-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4" id="programs_heading">
          <div className="max-w-md">
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase font-semibold mb-3 block">
              ПРОГРАММЫ
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
              ВЫБЕРИ СВОЙ ПУТЬ
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
              Три направления подготовки — от детских групп до полноконтактного спарринга.
            </p>
          </div>
        </div>

        {/* 3 Columns Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="programs_items_grid">
          {PROGRAMS.map((prog, idx) => (
            <motion.div
              key={idx}
              id={`program_card_${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`relative flex flex-col justify-between p-8 rounded-sm transition-all duration-300 ${
                prog.isPopular 
                  ? 'bg-zinc-950 border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.15)] ring-1 ring-red-600/20' 
                  : 'bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800'
              }`}
            >
              <div>
                {/* Visual Badge Tag */}
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 uppercase rounded-sm border ${
                    prog.isPopular 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}>
                    {prog.tag}
                  </span>
                </div>

                {/* Program Title */}
                <h3 className="font-display text-3xl font-black tracking-wider text-white mb-3 uppercase">
                  {prog.title}
                </h3>

                {/* Pricing info */}
                <div className="text-red-500 font-display text-xl sm:text-2xl font-bold mb-6">
                  {prog.price}
                </div>

                {/* Key Subtitle Text Details */}
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
                  {prog.details}
                </p>
              </div>

              {/* Action Button inside Program Card linking to lead capture and registration */}
              <button
                id={`program_btn_${idx}`}
                onClick={() => onSelectProgram(prog.title)}
                className={`w-full font-display font-medium uppercase tracking-wider text-xs sm:text-sm py-3.5 px-4 text-center rounded-sm transition-all duration-300 ${
                  prog.isPopular
                    ? 'bg-red-600 hover:bg-red-700 text-white font-bold hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                ЗАПИСАТЬСЯ НА КУРС
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

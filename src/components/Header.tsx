import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onTrialClick: () => void;
  onDashboardOpen: () => void;
}

export default function Header({ onTrialClick, onDashboardOpen }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 80; // height of fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      id="header_main"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
            id="header_logo"
          >
            <div className="w-9 h-9 bg-red-600 flex items-center justify-center font-display text-xl font-bold text-white transition-transform group-hover:scale-105 rounded-sm">
              С
            </div>
            <span className="font-display text-2xl font-bold tracking-wider text-white">
              СТАЛЬ
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" id="desktop_nav">
            <button
              onClick={() => scrollToSection('about')}
              className="text-zinc-400 hover:text-white font-medium text-sm tracking-wide uppercase transition-colors"
            >
              О ШКОЛЕ
            </button>
            <button
              onClick={() => scrollToSection('programs')}
              className="text-zinc-400 hover:text-white font-medium text-sm tracking-wide uppercase transition-colors"
            >
              ПРОГРАММЫ
            </button>
            <button
              onClick={() => scrollToSection('trainers')}
              className="text-zinc-400 hover:text-white font-medium text-sm tracking-wide uppercase transition-colors"
            >
              ТРЕНЕРЫ
            </button>
            <button
              onClick={() => scrollToSection('contacts')}
              className="text-zinc-400 hover:text-white font-medium text-sm tracking-wide uppercase transition-colors"
            >
              КОНТАКТЫ
            </button>
            
            {/* Dashboard Button */}
            <button
              onClick={onDashboardOpen}
              className="relative flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-mono border border-red-500/30 hover:border-red-500/60 bg-red-950/10 hover:bg-red-950/30 px-2.5 py-1 rounded transition-all"
              title="Админ-панель заявок"
              id="admin_panel_toggle"
            >
              <ShieldAlert size={14} className="animate-pulse" />
              <span>ЗАЯВКИ</span>
            </button>
          </nav>

          {/* Action Button & Menu */}
          <div className="hidden md:flex items-center gap-4">
            <button
              id="header_trial_btn"
              onClick={onTrialClick}
              className="bg-red-600 hover:bg-red-700 text-white font-display font-bold tracking-wider text-xs md:text-sm px-5 py-2.5 rounded-sm uppercase transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] active:scale-95"
            >
              ПРОБНАЯ ТРЕНИРОВКА
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onDashboardOpen}
              className="relative flex items-center justify-center text-red-500 hover:text-red-400 border border-red-500/30 px-2 py-1.5 rounded text-xs font-mono"
              id="mobile_admin_btn"
            >
              <ShieldAlert size={16} />
            </button>
            <button
              id="mobile_menu_trigger"
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-1"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile_nav_menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-t border-zinc-900 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-4">
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-zinc-300 hover:text-white font-medium text-base tracking-wide uppercase py-2 border-b border-zinc-900"
              >
                О ШКОЛЕ
              </button>
              <button
                onClick={() => scrollToSection('programs')}
                className="block w-full text-left text-zinc-300 hover:text-white font-medium text-base tracking-wide uppercase py-2 border-b border-zinc-900"
              >
                ПРОГРАММЫ
              </button>
              <button
                onClick={() => scrollToSection('trainers')}
                className="block w-full text-left text-zinc-300 hover:text-white font-medium text-base tracking-wide uppercase py-2 border-b border-zinc-900"
              >
                ТРЕНЕРЫ
              </button>
              <button
                onClick={() => scrollToSection('contacts')}
                className="block w-full text-left text-zinc-300 hover:text-white font-medium text-base tracking-wide uppercase py-2 border-b border-zinc-900"
              >
                КОНТАКТЫ
              </button>
              
              <div className="pt-2 flex flex-col gap-3">
                <button
                  id="mobile_nav_trial_btn"
                  onClick={() => {
                    setIsOpen(false);
                    onTrialClick();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-display font-medium tracking-wider text-sm py-3 px-4 rounded-sm uppercase text-center transition-colors"
                >
                  ПРОБНАЯ ТРЕНИРОВКА
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Trainers from './components/Trainers';
import TrialSection from './components/TrialSection';
import ContactsSection from './components/ContactsSection';
import LeadDashboard from './components/LeadDashboard';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [selectedProgramSignal, setSelectedProgramSignal] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleSelectProgram = (programName: string) => {
    setSelectedProgramSignal(programName);
    // reset after triggering
    setTimeout(() => {
      setSelectedProgramSignal('');
    }, 100);
  };

  const handleScrollToTrial = () => {
    const trialSec = document.getElementById('trial-section');
    if (trialSec) {
      trialSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToPrograms = () => {
    const progSec = document.getElementById('programs');
    if (progSec) {
      progSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0c0c0e] text-zinc-100 flex flex-col justify-between overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* Header component */}
      <Header
        onTrialClick={handleScrollToTrial}
        onDashboardOpen={() => setIsAdminOpen(true)}
      />

      {/* Main Single Page Sections */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <Hero 
          onTrialClick={handleScrollToTrial}
          onProgramsClick={handleScrollToPrograms}
        />

        {/* ABOUT SCHOOL SECTION */}
        <About />

        {/* PROGRAMS SECTION */}
        <Programs onSelectProgram={handleSelectProgram} />

        {/* TRAINERS SECTION */}
        <Trainers />

        {/* RECRUIT TRIAL SECTION */}
        <TrialSection
          selectedProgram={selectedProgramSignal}
        />

        {/* CONTACTS AND MESSAGE FEEDBACK SECTION */}
        <ContactsSection />

      </main>

      {/* FOOTER */}
      <footer className="bg-black py-10 border-t border-zinc-950 text-zinc-600 text-xs text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600/80 flex items-center justify-center text-white font-display font-medium text-xs rounded-sm">
                С
              </div>
              <span className="text-zinc-400 font-display font-bold tracking-wider text-sm">СТАЛЬ</span>
            </div>
            
            <p className="text-zinc-500 font-sans tracking-wide">
              Школа рукопашного боя «СТАЛЬ» г. Ставрополь · © 2014 - {new Date().getFullYear()} г. Все права защищены.
            </p>

            <span className="text-[10px] text-zinc-600 hover:text-red-500 cursor-pointer transition-colors" onClick={() => setIsAdminOpen(true)}>
              ⚙️ Панель Администратора
            </span>
          </div>
        </div>
      </footer>

      {/* ACTION ADMIN PANEL DASHBOARD OVERLAY */}
      <AnimatePresence>
        {isAdminOpen && (
          <LeadDashboard
            onClose={() => setIsAdminOpen(false)}
            onDataChanged={() => {}}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

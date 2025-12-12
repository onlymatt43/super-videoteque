import { useState } from 'react';
import { PayhipForm } from '../components/PayhipForm';
import { PreviewCarousel } from '../components/PreviewCarousel';
import { AIChat } from '../components/AIChat';

export const LandingPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
      {/* AI Assistant button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-night-light text-ember transition-all hover:bg-ember hover:text-night hover:scale-110 shadow-glow"
        title="Assistant AI"
      >
        <span className="text-lg font-bold">?</span>
      </button>

      {/* AI Chat Modal */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <section className="flex flex-col items-center justify-center gap-6 sm:gap-10 text-center px-2">
        {/* Logo - replace src with your logo */}
        <img 
          src="/logo.png" 
          alt="Super Vidéothèque" 
          className="h-20 sm:h-32 w-auto object-contain"
          onError={(e) => {
            // Fallback to text if logo not found
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <h1 className="hidden font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-[0.1em] sm:tracking-[0.2em] text-ember">
          Super Vidéothèque
        </h1>
        
        <PayhipForm />
      </section>
      
      <PreviewCarousel />
    </div>
  );
};

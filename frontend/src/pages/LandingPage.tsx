import { Link } from 'react-router-dom';
import { PayhipForm } from '../components/PayhipForm';
import { PreviewCarousel } from '../components/PreviewCarousel';

export const LandingPage = () => (
  <div>
    {/* Help button */}
    <Link 
      to="/questions" 
      className="fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-night-light text-ember transition-all hover:bg-ember hover:text-night hover:scale-110"
      title="Questions fréquentes"
    >
      <span className="text-lg font-bold">?</span>
    </Link>

    <section className="flex flex-col items-center justify-center gap-10 text-center">
      {/* Logo - replace src with your logo */}
      <img 
        src="/logo.png" 
        alt="Super Vidéothèque" 
        className="h-32 w-auto object-contain"
        onError={(e) => {
          // Fallback to text if logo not found
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <h1 className="hidden font-display text-5xl uppercase tracking-[0.2em] text-ember sm:text-6xl">
        Super Vidéothèque
      </h1>
      
      <PayhipForm />
    </section>
    
    <PreviewCarousel />
  </div>
);

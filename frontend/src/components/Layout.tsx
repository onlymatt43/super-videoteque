import { Link } from 'react-router-dom';
import { Popcorn, LogOut } from 'lucide-react';
import { useSession } from '../features/session/useSession';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { customerEmail, validation, clearSession } = useSession();

  return (
    <div className="min-h-screen bg-night text-white">
      <header className="sticky top-0 z-40 bg-gradient-to-b from-black/80 to-transparent py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold uppercase tracking-[0.35em] text-white">
            <Popcorn className="text-ember" size={32} />
            Super Videotheque
          </Link>
          {customerEmail && (
            <div className="flex items-center gap-4 text-sm text-slate">
              <div className="text-right">
                <p className="font-medium text-white">{customerEmail}</p>
                {validation?.productId && <p className="text-xs text-slate">Produit #{validation.productId}</p>}
              </div>
              <button
                type="button"
                onClick={clearSession}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wide text-white transition hover:border-white/50 hover:bg-white/10"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">{children}</main>
    </div>
  );
};

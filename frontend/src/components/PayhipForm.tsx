import { useState } from 'react';
import { validatePayhipCode } from '../api/payhip';
import { useSession } from '../features/session/useSession';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PayhipForm = () => {
  const navigate = useNavigate();
  const { setValidation } = useSession();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState<string>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code || !email) {
      setError('Complétez la clé de licence Payhip et votre email.');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      setError(undefined);
      const validation = await validatePayhipCode({ code });
      setValidation({ code, email, validation });
      setStatus('success');
      navigate('/catalog');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation Payhip impossible.';
      setError(message);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel w-full max-w-xl rounded-2xl p-6 backdrop-blur">
      <p className="mb-6 text-sm uppercase tracking-[0.4em] text-slate">Étape 1 · Clé de licence</p>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-white">Clé Payhip</label>
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value.trim())}
          placeholder="EXEMPLE-1234-ABCD"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-ember"
        />
      </div>
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-white">Email utilisé pour l'achat</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="monemail@email.com"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-ember"
        />
      </div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ember px-4 py-3 text-center text-base font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:bg-[#f6121d] disabled:cursor-not-allowed disabled:bg-ember/50"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Vérification en cours
          </>
        ) : (
          'Débloquer le catalogue'
        )}
      </button>
      {status === 'success' && <p className="mt-4 text-center text-sm text-green-400">Licence vérifiée ! Redirection vers le catalogue...</p>}
    </form>
  );
};

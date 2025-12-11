import { PayhipForm } from '../components/PayhipForm';

export const LandingPage = () => (
  <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.5em] text-ember">Super Videotheque</p>
      <h1 className="font-display text-5xl uppercase tracking-[0.2em] text-white sm:text-6xl">
        Vos locations premium en streaming instantané
      </h1>
      <p className="mt-6 text-lg text-slate">
        Entrez votre clé de licence Payhip pour débloquer un catalogue exclusif. Visionnage sécurisé via Bunny.net
        avec lecture mobile optimisée.
      </p>
      <ul className="mt-6 space-y-3 text-sm text-slate">
        <li>• Catalogue horizontale façon Netflix</li>
        <li>• Prévisualisation automatique après 4 secondes</li>
        <li>• Liens vidéo signés et temporisés</li>
      </ul>
    </div>
    <PayhipForm />
  </section>
);

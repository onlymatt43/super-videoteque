import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import type { Movie } from '../types';
import { fetchMovies } from '../api/movies';
import { PreviewPlayer } from './PreviewPlayer';
import clsx from 'clsx';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=60';
const FALLBACK_PREVIEW = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

interface PreviewCardProps {
  movie: Movie;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const PreviewCard = ({ movie, isActive, onHover, onLeave }: PreviewCardProps) => {
  const poster = movie.thumbnailUrl || FALLBACK_POSTER;
  const previewSource = movie.previewUrl || FALLBACK_PREVIEW;

  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={clsx(
        'relative h-56 w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-night-light poster-shadow transition-all duration-300',
        isActive ? 'scale-105 ring-2 ring-ember' : 'hover:scale-102'
      )}
    >
      <img src={poster} alt={movie.title} className="h-full w-full object-cover" loading="lazy" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-70" />
      
      {/* Play icon overlay */}
      <div className={clsx(
        'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
        isActive ? 'opacity-0' : 'opacity-100'
      )}>
        <div className="rounded-full bg-ember/80 p-3">
          <Play size={20} className="text-night" fill="currentColor" />
        </div>
      </div>

      {/* Title */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-sm font-semibold text-white line-clamp-1">{movie.title}</p>
        <p className="text-xs text-ember">Preview gratuit</p>
      </div>

      {/* Preview video */}
      <PreviewPlayer active={isActive} src={previewSource} />
    </article>
  );
};

export const PreviewCarousel = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data.slice(0, 8)); // Limiter à 8 previews
      } catch (err) {
        console.error('Failed to load preview movies:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  if (loading) {
    return (
      <section className="mt-16">
        <h2 className="mb-4 font-display text-2xl uppercase tracking-[0.3em] text-white">
          Previews Gratuits
        </h2>
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-56 w-40 animate-pulse rounded-2xl bg-night-light" />
          ))}
        </div>
      </section>
    );
  }

  if (!movies.length) return null;

  return (
    <section className="mt-16">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl uppercase tracking-[0.3em] text-white">
          <span className="text-ember">▶</span> Previews Gratuits
        </h2>
        <span className="text-xs uppercase tracking-[0.4em] text-slate">Survolez pour preview</span>
      </div>
      <div className="scroll-mask flex gap-5 overflow-x-auto pb-4">
        {movies.map((movie) => (
          <PreviewCard
            key={movie._id}
            movie={movie}
            isActive={activeId === movie._id}
            onHover={() => setActiveId(movie._id)}
            onLeave={() => setActiveId(null)}
          />
        ))}
      </div>
    </section>
  );
};

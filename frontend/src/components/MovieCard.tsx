import { useEffect } from 'react';
import { Play } from 'lucide-react';
import type { Movie } from '../types';
import { useCatalog } from '../features/catalog/useCatalog';
import { usePreviewTrigger } from '../hooks/usePreviewTrigger';
import { PreviewPlayer } from './PreviewPlayer';
import clsx from 'clsx';

interface Props {
  movie: Movie;
  onWatch: () => void;
}

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=60';
const FALLBACK_PREVIEW = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

export const MovieCard = ({ movie, onWatch }: Props) => {
  const previewingId = useCatalog((state) => state.previewingId);
  const setPreviewing = useCatalog((state) => state.setPreviewing);
  const { ref, shouldPreview } = usePreviewTrigger(4000);
  const isActive = previewingId === movie._id;

  useEffect(() => {
    if (shouldPreview && !isActive) {
      setPreviewing(movie._id);
    } else if (!shouldPreview && isActive) {
      setPreviewing(null);
    }
  }, [shouldPreview]);

  const poster = movie.thumbnailUrl || FALLBACK_POSTER;
  const previewSource = movie.previewUrl || FALLBACK_PREVIEW;

  return (
    <article
      ref={ref}
      className={clsx(
        'relative h-64 w-44 flex-shrink-0 overflow-hidden rounded-3xl bg-night-light poster-shadow transition hover:-translate-y-1',
        isActive && 'ring-2 ring-ember'
      )}
    >
      <img src={poster} alt={movie.title} className="h-full w-full object-cover" loading="lazy" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-sm font-semibold text-white">{movie.title}</p>
        <p className="line-clamp-2 text-xs text-slate">{movie.description}</p>
      </div>
      <div className="absolute inset-x-0 top-0 flex justify-end p-3">
        <button
          type="button"
          onClick={onWatch}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
        >
          <Play size={14} /> Regarder
        </button>
      </div>
      <PreviewPlayer active={isActive} src={previewSource} />
    </article>
  );
};

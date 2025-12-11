import type { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface CarouselProps {
  title: string;
  movies: Movie[];
  onWatch: (movie: Movie) => void;
}

export const Carousel = ({ title, movies, onWatch }: CarouselProps) => (
  <section className="mb-10">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-display text-3xl uppercase tracking-[0.3em] text-white">{title}</h2>
      <span className="text-xs uppercase tracking-[0.4em] text-slate">Swipe →</span>
    </div>
    <div className="scroll-mask flex gap-6 overflow-x-auto pb-4">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} onWatch={() => onWatch(movie)} />
      ))}
    </div>
  </section>
);

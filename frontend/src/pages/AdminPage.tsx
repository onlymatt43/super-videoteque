import { useState, useEffect } from 'react';
import { fetchMovies, updateMovie } from '../api/movies';
import type { Movie, MovieCategory } from '../types';
import { CATEGORY_LABELS } from '../types';

const CATEGORIES: MovieCategory[] = ['uncategorized', 'uncut', 'solo', 'duo', 'bts', 'compilation'];

export const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<MovieCategory | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await fetchMovies();
      setMovies(data);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (movieId: string, category: MovieCategory) => {
    setSaving(movieId);
    try {
      const updated = await updateMovie(movieId, { category });
      setMovies(prev => prev.map(m => m._id === movieId ? { ...m, category: updated.category } : m));
    } catch (error) {
      console.error('Failed to update category:', error);
    } finally {
      setSaving(null);
    }
  };

  const handleFreePreviewToggle = async (movieId: string, isFreePreview: boolean) => {
    setSaving(movieId);
    try {
      const updated = await updateMovie(movieId, { isFreePreview });
      setMovies(prev => prev.map(m => m._id === movieId ? { ...m, isFreePreview: updated.isFreePreview } : m));
    } catch (error) {
      console.error('Failed to update free preview:', error);
    } finally {
      setSaving(null);
    }
  };

  const handleTagsChange = async (movieId: string, tagsString: string) => {
    const tags = tagsString.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
    setSaving(movieId);
    try {
      const updated = await updateMovie(movieId, { tags });
      setMovies(prev => prev.map(m => m._id === movieId ? { ...m, tags: updated.tags } : m));
    } catch (error) {
      console.error('Failed to update tags:', error);
    } finally {
      setSaving(null);
    }
  };

  const filteredMovies = movies.filter(m => {
    const matchesCategory = filter === 'all' || (m.category || 'uncategorized') === filter;
    const matchesTag = !tagFilter || (m.tags || []).includes(tagFilter);
    return matchesCategory && matchesTag;
  });

  // Get all unique tags from all movies
  const allTags = [...new Set(movies.flatMap(m => m.tags || []))].sort();

  const getCategoryCounts = () => {
    const counts: Record<string, number> = { all: movies.length };
    CATEGORIES.forEach(cat => {
      counts[cat] = movies.filter(m => (m.category || 'uncategorized') === cat).length;
    });
    return counts;
  };

  const counts = getCategoryCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1214] flex items-center justify-center">
        <div className="text-[#ffd700] text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1214] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#ffd700] mb-6">🎬 Admin - Gestion des vidéos</h1>
        
        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-[#ffd700] text-[#0a1214] font-bold' 
                : 'bg-[#1a2428] text-white hover:bg-[#2a3438]'
            }`}
          >
            Tous ({counts.all})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === cat 
                  ? 'bg-[#ffd700] text-[#0a1214] font-bold' 
                  : 'bg-[#1a2428] text-white hover:bg-[#2a3438]'
              }`}
            >
              {CATEGORY_LABELS[cat]} ({counts[cat]})
            </button>
          ))}
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <span className="text-xs text-gray-400 mr-2">Tags:</span>
            <div className="inline-flex flex-wrap gap-2">
              <button
                onClick={() => setTagFilter(null)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  tagFilter === null
                    ? 'bg-[#ffd700] text-[#0a1214] font-bold'
                    : 'bg-[#1a2428] text-gray-300 hover:bg-[#2a3438]'
                }`}
              >
                Tous
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    tagFilter === tag
                      ? 'bg-[#ffd700] text-[#0a1214] font-bold'
                      : 'bg-[#1a2428] text-gray-300 hover:bg-[#2a3438]'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Movies grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMovies.map(movie => (
            <div 
              key={movie._id} 
              className={`bg-[#1a2428] rounded-lg overflow-hidden border-2 transition-all ${
                saving === movie._id ? 'border-[#ffd700] opacity-70' : 'border-transparent'
              }`}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-[#0a1214] relative">
                {movie.thumbnailUrl ? (
                  <img 
                    src={movie.thumbnailUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No thumbnail
                  </div>
                )}
                {movie.isFreePreview && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    FREE
                  </span>
                )}
              </div>
              
              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3 truncate" title={movie.title}>
                  {movie.title}
                </h3>
                
                {/* Category selector */}
                <div className="mb-3">
                  <label className="text-xs text-gray-400 block mb-1">Catégorie</label>
                  <select
                    value={movie.category || 'uncategorized'}
                    onChange={(e) => handleCategoryChange(movie._id, e.target.value as MovieCategory)}
                    disabled={saving === movie._id}
                    className="w-full bg-[#0a1214] border border-gray-600 rounded px-3 py-2 text-sm focus:border-[#ffd700] focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Free preview toggle */}
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={movie.isFreePreview || false}
                    onChange={(e) => handleFreePreviewToggle(movie._id, e.target.checked)}
                    disabled={saving === movie._id}
                    className="w-4 h-4 accent-[#ffd700]"
                  />
                  <span className="text-sm text-gray-300">Preview gratuit</span>
                </label>

                {/* Tags input */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tags (séparés par virgule)</label>
                  <input
                    type="text"
                    defaultValue={(movie.tags || []).join(', ')}
                    onBlur={(e) => handleTagsChange(movie._id, e.target.value)}
                    disabled={saving === movie._id}
                    placeholder="featured, new, 4k..."
                    className="w-full bg-[#0a1214] border border-gray-600 rounded px-3 py-2 text-sm focus:border-[#ffd700] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            Aucune vidéo dans cette catégorie
          </div>
        )}
      </div>
    </div>
  );
};

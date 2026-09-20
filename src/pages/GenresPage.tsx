import React, { useState } from 'react';
import { Compass, Film, ArrowRight } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';

interface GenresPageProps {
  initialSelected?: string;
}

export const GenresPage: React.FC<GenresPageProps> = ({ initialSelected }) => {
  const { genres, movies, navigate } = useMovieContext();
  const [selectedGenre, setSelectedGenre] = useState<string>(initialSelected || (genres[0]?.name || 'Action'));

  const publishedMovies = movies.filter(m => m.status === 'published');
  const filteredMovies = publishedMovies.filter(m => m.genre.includes(selectedGenre));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white flex items-center gap-2.5">
          <Compass className="w-7 h-7 text-amber-400" />
          <span>Browse Film Genres</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Explore legal movies grouped into distinct cinematic categories.
        </p>
      </div>

      {/* Genre Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {genres.map((g) => {
          const count = publishedMovies.filter(m => m.genre.includes(g.name)).length;
          const isSelected = selectedGenre === g.name;

          return (
            <button
              key={g._id}
              onClick={() => setSelectedGenre(g.name)}
              className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="font-display font-bold text-sm text-white">
                {g.name}
              </div>
              <div className="flex items-center justify-between text-xs pt-2 text-zinc-400">
                <span className="text-[11px]">{count} movie{count === 1 ? '' : 's'}</span>
                <span className={`text-xs ${isSelected ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Movies in Selected Genre */}
      <div className="space-y-4 pt-4 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-white">
              {selectedGenre} Showcase
            </h2>
            <p className="text-xs text-zinc-400">
              Showing {filteredMovies.length} legal movies categorized under {selectedGenre}.
            </p>
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-zinc-900/30 rounded-2xl border border-zinc-800/80 p-6">
            <Film className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-300">No movies currently tagged as {selectedGenre}</h4>
            <p className="text-xs text-zinc-500">More licensed open movies are continually being cataloged by the site administrator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {filteredMovies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

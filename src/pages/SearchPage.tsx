import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Film, X, Sparkles } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';

interface SearchPageProps {
  initialQuery?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '' }) => {
  const { movies, genres } = useMovieContext();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
    }
  }, [initialQuery]);

  // Extract unique languages and years
  const availableLanguages = useMemo(() => {
    return Array.from(new Set(movies.map(m => m.language)));
  }, [movies]);

  const availableYears = useMemo(() => {
    return Array.from(new Set(movies.map(m => m.year))).sort((a, b) => b - a);
  }, [movies]);

  // Search algorithm across title, genre, year, language, director, and cast
  const searchResults = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return movies.filter(movie => {
      if (movie.status !== 'published') return false;

      // Filter by genre
      if (selectedGenre !== 'all' && !movie.genre.includes(selectedGenre)) {
        return false;
      }

      // Filter by language
      if (selectedLanguage !== 'all' && movie.language !== selectedLanguage) {
        return false;
      }

      // Filter by year
      if (selectedYear !== 'all' && movie.year.toString() !== selectedYear) {
        return false;
      }

      // If no query string, keep
      if (!query) return true;

      // Matches in title, synopsis, genres, year, language, cast or director
      const matchesTitle = movie.title.toLowerCase().includes(query);
      const matchesDescription = movie.description.toLowerCase().includes(query);
      const matchesGenre = movie.genre.some(g => g.toLowerCase().includes(query));
      const matchesYear = movie.year.toString().includes(query);
      const matchesLang = movie.language.toLowerCase().includes(query);
      const matchesDirector = movie.director?.toLowerCase().includes(query);
      const matchesCast = movie.cast.some(c => c.toLowerCase().includes(query));

      return matchesTitle || matchesDescription || matchesGenre || matchesYear || matchesLang || matchesDirector || matchesCast;
    });
  }, [movies, searchTerm, selectedGenre, selectedLanguage, selectedYear]);

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setSelectedLanguage('all');
    setSelectedYear('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Search Legal Movies
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Instant search across titles, genres, release years, languages, directors, and actors in our verified open collection.
        </p>

        {/* Big Search Input Field */}
        <div className="relative w-full max-w-2xl mx-auto">
          <input
            id="movie-search-input"
            type="text"
            placeholder="e.g. Action, Sci-Fi, Buster Keaton, 1968, Animation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-zinc-900 border border-zinc-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl text-sm sm:text-base text-zinc-100 placeholder-zinc-500 shadow-xl outline-none transition-all"
            autoFocus
          />
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-4 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-3.5 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular quick tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs text-zinc-400">
          <span className="text-zinc-500 font-medium">Quick Suggestions:</span>
          {['Action', 'Sci-Fi', 'Horror', 'Animation', 'Comedy', '1080p', 'Public Domain'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filter Pills */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-semibold text-zinc-300 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Filters:
          </span>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 outline-none focus:border-amber-500"
          >
            <option value="all">All Genres</option>
            {genres.map(g => (
              <option key={g._id} value={g.name}>{g.name}</option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 outline-none focus:border-amber-500"
          >
            <option value="all">All Languages</option>
            {availableLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 outline-none focus:border-amber-500"
          >
            <option value="all">All Years</option>
            {availableYears.map(y => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
        </div>

        <div className="text-zinc-400">
          Showing <strong className="text-white font-bold">{searchResults.length}</strong> result{searchResults.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Results Grid */}
      {searchResults.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-zinc-900/30 rounded-2xl border border-zinc-800/80 p-8">
          <Film className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">No matching movies found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try searching for common keywords like "Sci-Fi", "Animation", or clearing your filters.
          </p>
          <button
            onClick={clearSearch}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors mt-2"
          >
            Clear Search &amp; Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {searchResults.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

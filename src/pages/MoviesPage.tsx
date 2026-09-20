import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Film, X } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';

interface MoviesPageProps {
  initialGenre?: string;
  initialSort?: string;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({ initialGenre, initialSort }) => {
  const { movies, genres, navigate } = useMovieContext();

  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre || 'all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>(initialSort || 'latest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Extract unique years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(movies.map(m => m.year))).sort((a, b) => b - a);
    return years;
  }, [movies]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      if (m.status !== 'published') return false;
      if (selectedGenre !== 'all' && !m.genre.includes(selectedGenre)) return false;
      if (selectedQuality !== 'all' && !m.quality.includes(selectedQuality)) return false;
      if (selectedYear !== 'all' && m.year.toString() !== selectedYear) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'popular') {
        return b.views - a.views;
      }
      if (sortBy === 'downloads') {
        return b.downloads - a.downloads;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'year') {
        return b.year - a.year;
      }
      return 0;
    });
  }, [movies, selectedGenre, selectedQuality, selectedYear, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage) || 1;
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedGenre('all');
    setSelectedQuality('all');
    setSelectedYear('all');
    setSortBy('latest');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedGenre !== 'all' || selectedQuality !== 'all' || selectedYear !== 'all' || sortBy !== 'latest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {selectedGenre !== 'all' ? `${selectedGenre} Movies` : 'All Legal Movies'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse our complete catalog of {filteredMovies.length} verified open-license and public domain films.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Genre Dropdown */}
          <select
            value={selectedGenre}
            onChange={(e) => { setSelectedGenre(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 outline-none focus:border-amber-500"
          >
            <option value="all">All Genres</option>
            {genres.map(g => (
              <option key={g._id} value={g.name}>{g.name}</option>
            ))}
          </select>

          {/* Quality Dropdown */}
          <select
            value={selectedQuality}
            onChange={(e) => { setSelectedQuality(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 outline-none focus:border-amber-500"
          >
            <option value="all">All Qualities</option>
            <option value="4K">4K Ultra HD</option>
            <option value="1080p">1080p Full HD</option>
            <option value="720p">720p HD</option>
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 outline-none focus:border-amber-500"
          >
            <option value="all">All Years</option>
            {availableYears.map(y => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-amber-400 font-medium outline-none focus:border-amber-500"
          >
            <option value="latest">Sort: Latest</option>
            <option value="popular">Sort: Most Viewed</option>
            <option value="downloads">Sort: Most Downloaded</option>
            <option value="year">Sort: Release Year</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid or Empty state */}
      {filteredMovies.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 bg-zinc-900/30 rounded-2xl border border-zinc-800/80 p-8">
          <Film className="w-12 h-12 text-zinc-600 mb-2" />
          <h3 className="text-lg font-bold text-zinc-200">No movies found</h3>
          <p className="text-xs text-zinc-400 max-w-sm">
            We couldn't find any films matching the selected filters. Try choosing a different genre or clearing your selection.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors mt-2"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {paginatedMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                  currentPage === page
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

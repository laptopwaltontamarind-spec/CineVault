import React, { useState, useMemo } from 'react';
import { Film, Search, Plus, Edit2, Trash2, CheckCircle2, EyeOff, Star, Eye, Download, AlertTriangle, ExternalLink } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';
import { AdminLayout } from '../../components/AdminLayout';
import { Movie } from '../../types';

export const AdminMovies: React.FC = () => {
  const { movies, genres, deleteMovie, togglePublish, toggleFeatured, navigate } = useMovieContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const availableYears = useMemo(() => {
    return Array.from(new Set(movies.map(m => m.year))).sort((a, b) => b - a);
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      if (searchQuery.trim() && !movie.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
      if (selectedGenre !== 'all' && !movie.genre.includes(selectedGenre)) {
        return false;
      }
      if (selectedStatus !== 'all' && movie.status !== selectedStatus) {
        return false;
      }
      if (selectedYear !== 'all' && movie.year.toString() !== selectedYear) {
        return false;
      }
      return true;
    });
  }, [movies, searchQuery, selectedGenre, selectedStatus, selectedYear]);

  const handleDeleteConfirm = () => {
    if (movieToDelete) {
      deleteMovie(movieToDelete._id);
      setMovieToDelete(null);
    }
  };

  return (
    <AdminLayout
      activeTab="movies"
      title="Movie Management"
      subtitle={`Manage, update, publish, or feature movies in your legal collection (${movies.length} total).`}
    >
      <div className="space-y-6">
        {/* Search, Filter & Add Top Row */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search movies by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-lg text-xs text-white placeholder-zinc-500 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Genre Filter */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 outline-none focus:border-amber-500"
            >
              <option value="all">All Genres</option>
              {genres.map(g => (
                <option key={g._id} value={g.name}>{g.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 outline-none focus:border-amber-500"
            >
              <option value="all">All Years</option>
              {availableYears.map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>

          <button
            id="admin-add-movie-action-btn"
            onClick={() => navigate({ name: 'admin_add_movie' })}
            className="w-full md:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Movie</span>
          </button>
        </div>

        {/* Movies Table */}
        <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Movie</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Genres</th>
                  <th className="py-3 px-4 text-center">Views</th>
                  <th className="py-3 px-4 text-center">Downloads</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredMovies.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                      No movies matched your current search filters.
                    </td>
                  </tr>
                ) : (
                  filteredMovies.map((movie) => (
                    <tr key={movie._id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* Title & Poster */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0 border border-zinc-800">
                            <img src={movie.poster_url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-white hover:text-amber-400 cursor-pointer flex items-center gap-1"
                              onClick={() => navigate({ name: 'movie', slug: movie.slug })}
                            >
                              <span>{movie.title}</span>
                              <ExternalLink className="w-3 h-3 text-zinc-500 opacity-60 hover:opacity-100" />
                            </div>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              /{movie.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Year */}
                      <td className="py-3 px-4 text-zinc-300 font-mono">
                        {movie.year}
                      </td>

                      {/* Genre */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {movie.genre.map(g => (
                            <span key={g} className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-3 px-4 text-center font-mono text-zinc-300">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3 text-zinc-500" />
                          <span>{movie.views.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Downloads */}
                      <td className="py-3 px-4 text-center font-mono text-zinc-300">
                        <div className="flex items-center justify-center gap-1">
                          <Download className="w-3 h-3 text-zinc-500" />
                          <span>{movie.downloads.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => togglePublish(movie._id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            movie.status === 'published'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/60'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                          }`}
                          title="Click to toggle status"
                        >
                          {movie.status}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleFeatured(movie._id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            movie.featured
                              ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                              : 'text-zinc-600 hover:text-zinc-400'
                          }`}
                          title="Click to toggle featured"
                        >
                          <Star className={`w-4 h-4 ${movie.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate({ name: 'admin_edit_movie', id: movie._id })}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors"
                            title="Edit movie"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setMovieToDelete(movie)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete movie"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal (Required by prompt: "Before deletion show confirmation: Are you sure you want to delete this movie?") */}
        {movieToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-white">Confirm Movie Deletion</h3>
                <p className="text-xs text-zinc-400">
                  Are you sure you want to delete this movie?
                </p>
                <div className="p-3 bg-zinc-950 rounded-xl text-left border border-zinc-800">
                  <span className="font-bold text-sm text-white">{movieToDelete.title}</span>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Year: {movieToDelete.year} • Views: {movieToDelete.views}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMovieToDelete(null)}
                  className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Yes, Delete Movie
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

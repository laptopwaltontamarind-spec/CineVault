import React from 'react';
import { Film, Eye, Download, Star, CheckCircle, FileText, PlusCircle, ArrowUpRight, TrendingUp, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';
import { AdminLayout } from '../../components/AdminLayout';

export const AdminDashboard: React.FC = () => {
  const { movies, genres, navigate } = useMovieContext();

  const totalMovies = movies.length;
  const publishedMovies = movies.filter(m => m.status === 'published').length;
  const draftMovies = movies.filter(m => m.status === 'draft').length;
  const totalViews = movies.reduce((acc, m) => acc + (m.views || 0), 0);
  const totalDownloads = movies.reduce((acc, m) => acc + (m.downloads || 0), 0);
  const featuredMovies = movies.filter(m => m.featured).length;

  // Top 5 performing movies by views
  const topMovies = [...movies].sort((a, b) => b.views - a.views).slice(0, 5);

  // Genre breakdown
  const genreBreakdown = genres.map(g => ({
    name: g.name,
    count: movies.filter(m => m.genre.includes(g.name)).length,
  })).sort((a, b) => b.count - a.count);

  const maxGenreCount = Math.max(...genreBreakdown.map(g => g.count), 1);

  return (
    <AdminLayout
      activeTab="dashboard"
      title="Admin Dashboard"
      subtitle="Overview of your legal streaming platform performance and catalog health."
    >
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium text-xs">Total Movies</span>
            <div className="text-2xl font-display font-extrabold text-white">
              {totalMovies}
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Film className="w-3 h-3 text-amber-400" />
              <span>Catalog items</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium text-xs">Published</span>
            <div className="text-2xl font-display font-extrabold text-emerald-400">
              {publishedMovies}
            </div>
            <div className="text-[11px] text-emerald-400/80 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Live on site</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium text-xs">Drafts</span>
            <div className="text-2xl font-display font-extrabold text-zinc-300">
              {draftMovies}
            </div>
            <div className="text-[11px] text-zinc-500 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>Unpublished</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium text-xs">Total Views</span>
            <div className="text-2xl font-display font-extrabold text-amber-400">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-400/80 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>Throttled hits</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium text-xs">Downloads</span>
            <div className="text-2xl font-display font-extrabold text-blue-400">
              {totalDownloads.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-400/80 flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>Direct files</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <span className="text-zinc-500 font-medium text-xs">Featured</span>
            <div className="text-2xl font-display font-extrabold text-amber-300">
              {featuredMovies}
            </div>
            <div className="text-[11px] text-amber-300/80 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Hero eligible</span>
            </div>
          </div>
        </div>

        {/* Visual Charts / Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Top Performing Movies (Bar Chart) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">
                  Top Viewed Movies
                </h3>
              </div>
              <button
                onClick={() => navigate({ name: 'admin_movies' })}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Manage All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {topMovies.map((movie) => {
                const maxViews = topMovies[0]?.views || 1;
                const percentage = Math.round((movie.views / maxViews) * 100);

                return (
                  <div key={movie._id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-semibold text-zinc-200 truncate max-w-xs sm:max-w-sm">
                        <span className="text-zinc-500 font-mono">#{topMovies.indexOf(movie) + 1}</span>
                        <span className="truncate">{movie.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-normal">
                          {movie.year}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400 font-mono text-[11px]">
                        <span className="text-amber-400 font-semibold">{movie.views.toLocaleString()} views</span>
                        <span>{movie.downloads.toLocaleString()} dl</span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Genre Catalog Distribution */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">
                  Genre Distribution
                </h3>
              </div>
              <button
                onClick={() => navigate({ name: 'admin_genres' })}
                className="text-xs text-amber-400 hover:underline"
              >
                Edit Genres
              </button>
            </div>

            <div className="space-y-2.5">
              {genreBreakdown.slice(0, 7).map((g) => {
                const percent = Math.round((g.count / maxGenreCount) * 100);
                return (
                  <div key={g.name} className="flex items-center justify-between gap-3 text-xs">
                    <span className="w-24 font-medium text-zinc-300 truncate">{g.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-zinc-950 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right font-mono text-zinc-400 text-[11px]">{g.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            id="admin-dash-add-movie-btn"
            onClick={() => navigate({ name: 'admin_add_movie' })}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all group"
          >
            <PlusCircle className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-white text-sm">Add New Movie</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Catalog a newly licensed or verified public domain film.
            </p>
          </button>

          <button
            onClick={() => navigate({ name: 'admin_settings' })}
            className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-left transition-all group"
          >
            <FileText className="w-6 h-6 text-zinc-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-white text-sm">Configure Platform</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Update branding, site title, logo, DMCA officer, and analytics.
            </p>
          </button>

          <button
            onClick={() => navigate({ name: 'admin_deployment' })}
            className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-left transition-all group"
          >
            <TrendingUp className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-white text-sm">Render &amp; Python Code</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Inspect backend Flask routes, MongoDB models, and Procfile.
            </p>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

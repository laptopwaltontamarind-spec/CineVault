import React from 'react';
import { Film, Flame, Sparkles, Compass, ShieldCheck, ArrowRight } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { HeroBanner } from '../components/HeroBanner';
import { MovieCard } from '../components/MovieCard';
import { AdBanner } from '../components/AdBanner';

export const HomePage: React.FC = () => {
  const { movies, genres, ads, navigate } = useMovieContext();

  const publishedMovies = movies.filter(m => m.status === 'published');
  const featuredMovie = publishedMovies.find(m => m.featured) || publishedMovies[0];

  // Latest movies sorted by created_at or year
  const latestMovies = [...publishedMovies].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Popular movies sorted by view count
  const popularMovies = [...publishedMovies].sort((a, b) => b.views - a.views);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Hero Section or Clean State */}
      {featuredMovie ? (
        <HeroBanner movie={featuredMovie} />
      ) : (
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
            <Film className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Movie Catalog Ready
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              সমস্ত ডেমো মুভি সফলভাবে মুছে ফেলা হয়েছে। সাধারণ ব্যবহারকারীরা সাইটের কোনো কিছু ডিলিট বা পরিবর্তন করতে পারবে না। শুধুমাত্র অ্যাডমিন প্যানেলে লগইন করে নতুন মুভি যুক্ত করা যাবে।
            </p>
            <p className="text-xs text-zinc-400">
              Visitors can browse, stream, and download freely without registration once movies are published.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate({ name: 'admin_login' })}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Go to Admin Panel (অ্যাডমিন প্যানেল)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate({ name: 'legal' })}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-semibold text-xs transition-colors"
            >
              Legal &amp; DMCA Documentation
            </button>
          </div>
        </div>
      )}

      {/* Homepage Ad slot */}
      <AdBanner
        enabled={ads.homepage_ad_enabled}
        code={ads.homepage_ad_code}
        type="homepage"
      />

      {/* Genres Browse Strip */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              Explore by Genre
            </h2>
          </div>
          <button
            onClick={() => navigate({ name: 'genres' })}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            All Genres <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {genres.map((g) => {
            const count = publishedMovies.filter(m => m.genre.includes(g.name)).length;
            return (
              <button
                key={g._id}
                onClick={() => navigate({ name: 'movies', genre: g.name })}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/80 text-zinc-200 text-xs font-medium transition-all group flex items-center gap-2"
              >
                <span>{g.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 group-hover:bg-amber-500/20 group-hover:text-amber-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Latest Movies Section */}
      {latestMovies.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                Latest Movies
              </h2>
            </div>
            <button
              onClick={() => navigate({ name: 'latest' })}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              View More <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Responsive Grid: Mobile 2, Tablet 3, Desktop 4-6 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {latestMovies.slice(0, 12).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Movies Section */}
      {popularMovies.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                Popular Movies
              </h2>
            </div>
            <button
              onClick={() => navigate({ name: 'popular' })}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              View Ranking <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {popularMovies.slice(0, 6).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* Legal Movie Streaming Assurance Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Authorized Legal Streaming Guarantee</span>
          </div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-white">
            100% Free, Safe, &amp; Copyright-Compliant
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            All videos and download mirrors are hosted under Creative Commons Attribution licenses, open-source movie community grants (Peach, Orange, Mango Blender Projects), or certified Public Domain worldwide. No user sign-up required, no deceptive popups.
          </p>
        </div>

        <button
          onClick={() => navigate({ name: 'legal' })}
          className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-colors"
        >
          View Legal Documentation
        </button>
      </div>
    </div>
  );
};

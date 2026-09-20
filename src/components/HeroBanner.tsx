import React from 'react';
import { Play, Info, ShieldCheck, Sparkles, Clock, Calendar, Eye, Download } from 'lucide-react';
import { Movie } from '../types';
import { useMovieContext } from '../context/MovieContext';

interface HeroBannerProps {
  movie: Movie;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movie }) => {
  const { navigate } = useMovieContext();

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl mb-12">
      {/* Background Banner Image with Dark Gradient Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.banner_url || movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105 transform hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-3xl flex flex-col justify-center min-h-[420px] sm:min-h-[480px]">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20">
            Featured Premiere
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {movie.license_type || '100% Legal Public Stream'}
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-mono">
            {movie.quality.join(' / ')}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-none mb-3">
          {movie.title}
        </h1>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            {movie.year}
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {movie.runtime}
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
          <span className="text-zinc-200 font-medium">
            {movie.genre.join(', ')}
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            {movie.views.toLocaleString()} views
          </span>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl line-clamp-3 sm:line-clamp-4 mb-6">
          {movie.description}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            id="hero-watch-btn"
            onClick={() => navigate({ name: 'watch', slug: movie.slug })}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>Watch Online Now</span>
          </button>

          <button
            id="hero-details-btn"
            onClick={() => navigate({ name: 'movie', slug: movie.slug })}
            className="px-5 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/80 font-semibold text-sm sm:text-base flex items-center gap-2 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
            <span>View Details &amp; Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Play, Eye, Download, ShieldCheck, Film } from 'lucide-react';
import { Movie } from '../types';
import { useMovieContext } from '../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { navigate } = useMovieContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Highest quality badge
  const primaryQuality = movie.quality && movie.quality.length > 0 ? movie.quality[0] : 'HD';

  return (
    <div className="group relative flex flex-col bg-zinc-900/60 rounded-xl overflow-hidden border border-zinc-800/80 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
      {/* Poster Container */}
      <div 
        className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950 cursor-pointer"
        onClick={() => navigate({ name: 'movie', slug: movie.slug })}
      >
        {/* Placeholder skeleton while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <Film className="w-8 h-8 text-zinc-700" />
          </div>
        )}

        <img
          src={movie.poster_url}
          alt={`${movie.title} poster`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Fallback if image fails */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-4 text-center">
            <Film className="w-10 h-10 text-amber-500/60 mb-2" />
            <span className="text-xs font-semibold text-zinc-300 line-clamp-2">{movie.title}</span>
          </div>
        )}

        {/* Top Badges: Quality & Legal status */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md border border-zinc-700 text-amber-400 font-bold text-[10px] tracking-wider uppercase shadow-md">
            {primaryQuality}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/85 backdrop-blur-md border border-emerald-700/60 text-emerald-300 font-medium text-[10px] flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Legal
          </span>
        </div>

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 space-y-2">
          <div className="space-y-1">
            <p className="text-[11px] text-zinc-300 line-clamp-2 leading-snug">
              {movie.description}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-zinc-400" />
                {movie.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3 text-zinc-400" />
                {movie.downloads.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate({ name: 'watch', slug: movie.slug });
              }}
              className="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors shadow-md"
            >
              <Play className="w-3 h-3 fill-current" />
              Watch
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate({ name: 'movie', slug: movie.slug });
              }}
              className="w-full py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium rounded-lg text-xs flex items-center justify-center transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3 flex flex-col flex-grow justify-between gap-1.5">
        <div>
          <button
            onClick={() => navigate({ name: 'movie', slug: movie.slug })}
            className="text-left font-semibold text-sm text-zinc-100 hover:text-amber-400 line-clamp-1 transition-colors w-full"
            title={movie.title}
          >
            {movie.title}
          </button>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
            <span>{movie.year}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
            <span>{movie.runtime}</span>
          </div>
        </div>

        {/* Genres Pill List */}
        <div className="flex items-center gap-1 overflow-hidden pt-1">
          {movie.genre.slice(0, 2).map((g) => (
            <button
              key={g}
              onClick={(e) => {
                e.stopPropagation();
                navigate({ name: 'movies', genre: g });
              }}
              className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors whitespace-nowrap"
            >
              {g}
            </button>
          ))}
          {movie.genre.length > 2 && (
            <span className="text-[10px] text-zinc-500">+{movie.genre.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

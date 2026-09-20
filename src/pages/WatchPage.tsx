import React, { useEffect, useState } from 'react';
import { Play, Download, ArrowLeft, Eye, ShieldCheck, Share2, Check, Film } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { MovieCard } from '../components/MovieCard';
import { AdBanner } from '../components/AdBanner';

interface WatchPageProps {
  slug: string;
}

export const WatchPage: React.FC<WatchPageProps> = ({ slug }) => {
  const { getMovieBySlug, movies, ads, incrementView, incrementDownload, navigate } = useMovieContext();
  const [copied, setCopied] = useState(false);

  const movie = getMovieBySlug(slug);

  // Trigger anti-abuse view counter increment on mount
  useEffect(() => {
    if (movie) {
      incrementView(movie.slug);
    }
  }, [movie?.slug, incrementView]);

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Film className="w-12 h-12 text-zinc-600 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
        <p className="text-sm text-zinc-400">The requested film could not be located in our streaming library.</p>
        <button
          onClick={() => navigate({ name: 'home' })}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Recommended up-next queue
  const recommendations = movies
    .filter(m => m.status === 'published' && m.slug !== movie.slug)
    .slice(0, 4);

  const handleDownload = () => {
    incrementDownload(movie.slug);
    const link = movie.download_url || movie.video_url;
    window.open(link, '_blank');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate({ name: 'movie', slug: movie.slug })}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movie Info</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={copyShareLink}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Video Player Container */}
      <div className="w-full">
        <VideoPlayer movie={movie} />
      </div>

      {/* Watch Page Ad Slot */}
      <AdBanner
        enabled={ads.watch_page_ad_enabled}
        code={ads.watch_page_ad_code}
        type="watch"
      />

      {/* Video Information & Meta Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-400 mt-1">
                <span className="text-amber-400 font-semibold">{movie.year}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
                <span>•</span>
                <span>{movie.language}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <Eye className="w-3.5 h-3.5 text-zinc-500" />
                  {movie.views.toLocaleString()} views
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Licensed Stream
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
              Film Overview
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {movie.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">License Verification:</span>
              <span className="text-zinc-200 font-medium">{movie.license_type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Director:</span>
              <span className="text-zinc-200 font-medium">{movie.director || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Starring:</span>
              <span className="text-zinc-200 font-medium">{movie.cast.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Right column: Up Next Recommendations */}
        <div className="space-y-4">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <span>Up Next</span>
            <span className="text-xs font-normal text-zinc-400">(Legal Archive)</span>
          </h3>

          <div className="space-y-3">
            {recommendations.map(rec => (
              <div
                key={rec._id}
                onClick={() => navigate({ name: 'watch', slug: rec.slug })}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer transition-all group"
              >
                <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-950">
                  <img src={rec.poster_url} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 fill-current transition-opacity" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-100 group-hover:text-amber-400 line-clamp-1 transition-colors">
                    {rec.title}
                  </h4>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {rec.year} • {rec.runtime}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-500">
                    <span>{rec.genre[0]}</span>
                    <span>•</span>
                    <span className="text-amber-400/80 font-mono">{rec.quality[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

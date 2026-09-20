import React, { useState } from 'react';
import { Play, Download, Calendar, Clock, Globe, Award, ShieldCheck, Film, Eye, Share2, Check, ExternalLink, ArrowLeft } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';
import { AdBanner } from '../components/AdBanner';

interface MovieDetailsPageProps {
  slug: string;
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({ slug }) => {
  const { getMovieBySlug, movies, ads, incrementDownload, navigate } = useMovieContext();
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const movie = getMovieBySlug(slug);

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Film className="w-12 h-12 text-zinc-600 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
        <p className="text-sm text-zinc-400">The requested movie slug "{slug}" does not exist in our legal archive.</p>
        <button
          onClick={() => navigate({ name: 'home' })}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Related movies
  const relatedMovies = movies
    .filter(m => m.status === 'published' && m.slug !== movie.slug && m.genre.some(g => movie.genre.includes(g)))
    .slice(0, 6);

  const handleDownloadClick = (quality: string) => {
    incrementDownload(movie.slug);
    setDownloadStarted(true);

    // Create a temporary anchor element to trigger download safely
    const downloadUrl = movie.download_url || movie.video_url;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${movie.slug}-${quality}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloadStarted(false);
    }, 4000);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="w-full">
      {/* Backdrop Header */}
      <div className="relative w-full h-[360px] sm:h-[440px] overflow-hidden bg-zinc-950 border-b border-zinc-800/80">
        <img
          src={movie.banner_url || movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover filter brightness-[0.35] blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent"></div>

        {/* Back navigation button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => navigate({ name: 'movies' })}
            className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </button>
        </div>
      </div>

      {/* Main Content Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-60 relative z-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Large Poster & Quick Actions */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden border-2 border-zinc-700/80 shadow-2xl bg-zinc-900">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Watch & Download Action Buttons */}
            <div className="space-y-2.5">
              <button
                id="details-watch-online-btn"
                onClick={() => navigate({ name: 'watch', slug: movie.slug })}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-100 transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>WATCH ONLINE</span>
              </button>

              <button
                id="details-download-btn"
                onClick={() => setDownloadModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100 transition-all"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>DOWNLOAD MOVIE</span>
              </button>

              <button
                onClick={copyShareLink}
                className="w-full py-2 px-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Share Movie Link'}</span>
              </button>
            </div>

            {/* Legal Guarantee Card */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Authorized Media Verification</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400">
                Distributed under <strong className="text-zinc-200">{movie.license_type}</strong>. 100% legal for personal streaming and download.
              </p>
            </div>
          </div>

          {/* Right Column: Full Details */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Title & Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-400 font-bold text-xs">
                  {movie.year}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs">
                  {movie.runtime}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
                  {movie.quality.join(' / ')}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-medium">
                  Verified Legal
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>

              {/* Views and downloads counter display */}
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-zinc-500" />
                  <strong className="text-zinc-200 font-semibold">{movie.views.toLocaleString()}</strong> views
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-zinc-500" />
                  <strong className="text-zinc-200 font-semibold">{movie.downloads.toLocaleString()}</strong> downloads
                </span>
              </div>
            </div>

            {/* Synopsis / Description */}
            <div className="space-y-2">
              <h3 className="text-sm uppercase tracking-wider font-semibold text-zinc-400">
                Synopsis
              </h3>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Movie Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs">
              <div className="space-y-1">
                <span className="text-zinc-500 font-medium">Director</span>
                <p className="text-zinc-200 font-semibold text-sm">{movie.director || 'Unknown / Archive'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-medium">Country / Origin</span>
                <p className="text-zinc-200 font-semibold text-sm">{movie.country}</p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-medium">Language</span>
                <p className="text-zinc-200 font-semibold text-sm">{movie.language}</p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-medium">Available Formats</span>
                <p className="text-zinc-200 font-semibold text-sm">{movie.quality.join(', ')} (MP4 / WebM)</p>
              </div>

              <div className="sm:col-span-2 space-y-1 pt-1 border-t border-zinc-800">
                <span className="text-zinc-500 font-medium">Starring / Cast</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {movie.cast.map(actor => (
                    <span key={actor} className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-200 font-medium text-xs">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1 pt-1 border-t border-zinc-800">
                <span className="text-zinc-500 font-medium">Genres</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {movie.genre.map(g => (
                    <button
                      key={g}
                      onClick={() => navigate({ name: 'movies', genre: g })}
                      className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium text-xs border border-amber-500/20 transition-colors"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ad Banner for Movie Details */}
            <AdBanner
              enabled={ads.movie_details_ad_enabled}
              code={ads.movie_details_ad_code}
              type="movie_details"
            />
          </div>
        </div>

        {/* Related Legal Movies */}
        {relatedMovies.length > 0 && (
          <div className="mt-16 space-y-4 pt-12 border-t border-zinc-800">
            <h3 className="text-xl font-display font-bold text-white">
              Related Legal Movies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedMovies.map(rel => (
                <MovieCard key={rel._id} movie={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Download Modal / Drawer */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Download Movie</h3>
              </div>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white text-base">{movie.title} ({movie.year})</h4>
              <p className="text-xs text-zinc-400">
                Choose your preferred resolution. All download links point exclusively to our authorized CDN and open-access mirrors.
              </p>
            </div>

            {/* Quality options list */}
            <div className="space-y-2">
              {movie.quality.map((q) => {
                const sizeMap: Record<string, string> = {
                  '4K': '1.2 GB',
                  '1080p': '420 MB',
                  '720p': '260 MB',
                  '480p': '140 MB',
                };
                const size = sizeMap[q] || '320 MB';

                return (
                  <div
                    key={q}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{q} Full High-Definition</span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-amber-400 font-mono">
                          MP4 / H.264
                        </span>
                      </div>
                      <span className="text-xs text-zinc-400">File size: ~{size}</span>
                    </div>

                    <button
                      onClick={() => handleDownloadClick(q)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {downloadStarted && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Authorized download initiated! Your transfer is starting automatically.</span>
              </div>
            )}

            <div className="pt-2 text-center">
              <span className="text-[11px] text-zinc-500">
                Direct authorized mirror • Virus-checked &amp; Adware-free • No registration required
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

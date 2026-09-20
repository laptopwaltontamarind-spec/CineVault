import React, { useState } from 'react';
import { PlusCircle, Film, ArrowLeft, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';
import { AdminLayout } from '../../components/AdminLayout';

export const AdminAddMovie: React.FC = () => {
  const { genres, addMovie, navigate } = useMovieContext();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Action']);
  const [language, setLanguage] = useState('English');
  const [country, setCountry] = useState('USA');
  const [runtime, setRuntime] = useState('90 min');
  const [selectedQualities, setSelectedQualities] = useState<string[]>(['1080p']);
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [licenseType, setLicenseType] = useState('Creative Commons Attribution 3.0 (Authorized)');
  const [fileSize, setFileSize] = useState('450 MB');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto slug generation on title change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleGenreToggle = (genreName: string) => {
    if (selectedGenres.includes(genreName)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter(g => g !== genreName));
      }
    } else {
      setSelectedGenres([...selectedGenres, genreName]);
    }
  };

  const handleQualityToggle = (q: string) => {
    if (selectedQualities.includes(q)) {
      if (selectedQualities.length > 1) {
        setSelectedQualities(selectedQualities.filter(item => item !== q));
      }
    } else {
      setSelectedQualities([...selectedQualities, q]);
    }
  };

  const handleSubmit = (forcedStatus?: 'published' | 'draft') => {
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Movie title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Movie description/synopsis is required.');
      return;
    }
    if (!videoUrl.trim()) {
      setError('Authorized video stream URL is required.');
      return;
    }

    const finalStatus = forcedStatus || status;
    const finalPoster = posterUrl.trim() || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80';
    const finalBanner = bannerUrl.trim() || finalPoster;
    const finalDownload = downloadUrl.trim() || videoUrl.trim();

    const castList = cast.split(',').map(c => c.trim()).filter(Boolean);

    addMovie({
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      poster_url: finalPoster,
      banner_url: finalBanner,
      video_url: videoUrl.trim(),
      download_url: finalDownload,
      year: Number(year) || 2026,
      genre: selectedGenres,
      language: language.trim() || 'English',
      country: country.trim() || 'USA',
      runtime: runtime.trim() || '90 min',
      quality: selectedQualities,
      director: director.trim() || 'Independent / Archive',
      cast: castList.length > 0 ? castList : ['Lead Actor'],
      featured,
      status: finalStatus,
      license_type: licenseType.trim(),
      file_size: fileSize.trim(),
    });

    setSuccess(true);
    setTimeout(() => {
      navigate({ name: 'admin_movies' });
    }, 800);
  };

  return (
    <AdminLayout
      activeTab="add_movie"
      title="Add Legal Movie"
      subtitle="Catalog a new authorized or public domain movie record."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ name: 'admin_movies' })}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movies Table</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2.5">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Movie successfully cataloged! Redirecting to movies list...</span>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6 bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 rounded-2xl">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">
                Movie Title <span className="text-amber-400">*</span>
              </label>
              <input
                id="add-movie-title-input"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Cosmos Laundromat"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cosmos-laundromat"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 font-mono text-xs text-amber-400 outline-none"
              />
              <span className="text-[10px] text-zinc-500">Auto-generated from title for /movie/{slug || '...'}</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">
                Release Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">
                Synopsis / Description <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed storyline, synopsis, or background summary..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Media URLs */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Media &amp; Streaming URLs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Video Stream URL (MP4 / WebM) <span className="text-amber-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://.../video.mp4"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl font-mono text-xs text-white outline-none"
                />
                <span className="text-[10px] text-zinc-500">Direct streaming video source for HTML5 player</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Authorized Download URL
                </label>
                <input
                  type="url"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://.../download.mp4 (Optional, defaults to video URL)"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 font-mono text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Poster Image URL
                </label>
                <input
                  type="url"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Banner / Backdrop Image URL
                </label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Genres & Qualities */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-200">
                Genres (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {genres.map(g => {
                  const active = selectedGenres.includes(g.name);
                  return (
                    <button
                      type="button"
                      key={g._id}
                      onClick={() => handleGenreToggle(g.name)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        active
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-200">
                Supported Video Qualities
              </label>
              <div className="flex items-center gap-3">
                {['480p', '720p', '1080p', '4K'].map(q => {
                  const checked = selectedQualities.includes(q);
                  return (
                    <label key={q} className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleQualityToggle(q)}
                        className="rounded bg-zinc-950 border-zinc-800 text-amber-500 accent-amber-500"
                      />
                      <span>{q}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">Runtime</label>
              <input
                type="text"
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
                placeholder="110 min"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="English"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA / Netherlands"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none rounded-lg"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-200">Director</label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Director Name"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">Approx File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="450 MB"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none rounded-lg"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="text-xs font-semibold text-zinc-200">Cast (comma-separated)</label>
              <input
                type="text"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
                placeholder="Actor One, Actor Two, Actor Three"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none rounded-lg"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="text-xs font-semibold text-zinc-200">License Verification Terms</label>
              <input
                type="text"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                placeholder="Creative Commons Attribution 3.0 / Public Domain"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-emerald-300 font-mono outline-none rounded-lg"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-800 text-amber-500 accent-amber-500"
              />
              <span className="font-semibold">Feature on Homepage Banner</span>
            </label>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-zinc-300">Status:</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="accent-amber-500"
                />
                <span className="text-emerald-400 font-bold">Published</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="accent-amber-500"
                />
                <span className="text-zinc-400">Draft</span>
              </label>
            </div>
          </div>

          {/* Action Buttons (Required by prompt: Save Movie, Save as Draft, Publish) */}
          <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap items-center gap-3">
            <button
              id="admin-save-movie-btn"
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20"
            >
              Save Movie
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('published')}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Publish Now
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

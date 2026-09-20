import React, { useState, useEffect } from 'react';
import { Edit3, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';
import { AdminLayout } from '../../components/AdminLayout';

interface AdminEditMovieProps {
  id: string;
}

export const AdminEditMovie: React.FC<AdminEditMovieProps> = ({ id }) => {
  const { getMovieById, genres, updateMovie, navigate } = useMovieContext();
  const movie = getMovieById(id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [runtime, setRuntime] = useState('');
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [licenseType, setLicenseType] = useState('');
  const [fileSize, setFileSize] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (movie) {
      setTitle(movie.title);
      setSlug(movie.slug);
      setDescription(movie.description);
      setPosterUrl(movie.poster_url);
      setBannerUrl(movie.banner_url || movie.poster_url);
      setVideoUrl(movie.video_url);
      setDownloadUrl(movie.download_url || movie.video_url);
      setYear(movie.year);
      setSelectedGenres(movie.genre);
      setLanguage(movie.language);
      setCountry(movie.country);
      setRuntime(movie.runtime);
      setSelectedQualities(movie.quality);
      setDirector(movie.director);
      setCast(movie.cast.join(', '));
      setFeatured(movie.featured);
      setStatus(movie.status);
      setLicenseType(movie.license_type || '');
      setFileSize(movie.file_size || '450 MB');
    }
  }, [movie]);

  if (!movie) {
    return (
      <AdminLayout activeTab="movies" title="Movie Not Found">
        <div className="p-8 text-center bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3">
          <p className="text-zinc-400">Movie with ID {id} was not found.</p>
          <button
            onClick={() => navigate({ name: 'admin_movies' })}
            className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-lg"
          >
            Back to Movies
          </button>
        </div>
      </AdminLayout>
    );
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !videoUrl.trim() || !description.trim()) {
      setError('Title, description, and video URL are mandatory.');
      return;
    }

    const castList = cast.split(',').map(c => c.trim()).filter(Boolean);

    updateMovie(movie._id, {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      poster_url: posterUrl.trim(),
      banner_url: bannerUrl.trim(),
      video_url: videoUrl.trim(),
      download_url: downloadUrl.trim() || videoUrl.trim(),
      year: Number(year),
      genre: selectedGenres,
      language: language.trim(),
      country: country.trim(),
      runtime: runtime.trim(),
      quality: selectedQualities,
      director: director.trim(),
      cast: castList,
      featured,
      status,
      license_type: licenseType.trim(),
      file_size: fileSize.trim(),
    });

    setSuccess(true);
    setTimeout(() => {
      navigate({ name: 'admin_movies' });
    }, 600);
  };

  return (
    <AdminLayout
      activeTab="movies"
      title={`Edit Movie: ${movie.title}`}
      subtitle="Modify all attributes, streaming sources, and distribution parameters."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate({ name: 'admin_movies' })}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movies Table</span>
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Movie updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">Movie Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 font-mono text-xs text-amber-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">Release Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200">Synopsis</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Media Sources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Authorized Video Stream URL</label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 font-mono text-xs text-white outline-none rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Authorized Download URL</label>
                <input
                  type="url"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 font-mono text-xs text-white outline-none rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Poster URL</label>
                <input
                  type="url"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Banner URL</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white outline-none rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-3">
            <label className="text-xs font-semibold text-zinc-200">Genres</label>
            <div className="flex flex-wrap gap-1.5">
              {genres.map(g => (
                <button
                  type="button"
                  key={g._id}
                  onClick={() => handleGenreToggle(g.name)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    selectedGenres.includes(g.name) ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-950 border border-zinc-800 text-zinc-400'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-amber-500"
              />
              <span>Featured on Homepage</span>
            </label>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-zinc-300">Status:</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="edit_status"
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
                  name="edit_status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="accent-amber-500"
                />
                <span className="text-zinc-400">Draft</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20"
            >
              Update Movie
            </button>
            <button
              type="button"
              onClick={() => navigate({ name: 'admin_movies' })}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

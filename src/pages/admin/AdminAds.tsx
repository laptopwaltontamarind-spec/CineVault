import React, { useState } from 'react';
import { Megaphone, Check, ShieldCheck, Code, Eye } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';
import { AdminLayout } from '../../components/AdminLayout';

export const AdminAds: React.FC = () => {
  const { ads, updateAds } = useMovieContext();
  const [formData, setFormData] = useState({ ...ads });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAds(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <AdminLayout
      activeTab="ads"
      title="Advertisement Management"
      subtitle="Safely toggle and configure banner ads, sponsorships, or ethical advertising snippets."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Ad configurations updated and saved!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Homepage Ad */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Homepage Sponsor / Ad Banner</h3>
                <p className="text-xs text-zinc-400">Displayed on the public index page below featured categories.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.homepage_ad_enabled}
                  onChange={(e) => setFormData({ ...formData, homepage_ad_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {formData.homepage_ad_enabled && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Homepage Ad HTML / JS Code Snippet</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.homepage_ad_code}
                  onChange={(e) => setFormData({ ...formData, homepage_ad_code: e.target.value })}
                  placeholder="<!-- Paste banner script or <div> here -->"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Section 2: Movie Details Ad */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Movie Details Page Ad</h3>
                <p className="text-xs text-zinc-400">Rendered on the synopsis page above related recommendations.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.movie_details_ad_enabled}
                  onChange={(e) => setFormData({ ...formData, movie_details_ad_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {formData.movie_details_ad_enabled && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Details Page Ad HTML / JS Code</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.movie_details_ad_code}
                  onChange={(e) => setFormData({ ...formData, movie_details_ad_code: e.target.value })}
                  placeholder="<!-- Paste script or sponsor container here -->"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Section 3: Watch Page Ad */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Watch Page Ad</h3>
                <p className="text-xs text-zinc-400">Positioned immediately under the active video player viewport.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.watch_page_ad_enabled}
                  onChange={(e) => setFormData({ ...formData, watch_page_ad_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {formData.watch_page_ad_enabled && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Watch Page Ad HTML / JS Code</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.watch_page_ad_code}
                  onChange={(e) => setFormData({ ...formData, watch_page_ad_code: e.target.value })}
                  placeholder="<!-- Paste video player banner code -->"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Section 4: Download Page Ad */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Download Drawer / Modal Ad</h3>
                <p className="text-xs text-zinc-400">Positioned above the authorized CDN download selection links.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.download_page_ad_enabled}
                  onChange={(e) => setFormData({ ...formData, download_page_ad_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {formData.download_page_ad_enabled && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Page Ad HTML / JS Code</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.download_page_ad_code}
                  onChange={(e) => setFormData({ ...formData, download_page_ad_code: e.target.value })}
                  placeholder="<!-- Paste download sponsor banner -->"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-300 outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20"
            >
              Save Ad Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

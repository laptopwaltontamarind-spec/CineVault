import React from 'react';
import { Film, ShieldCheck, Heart, Lock, ExternalLink, Sparkles } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

export const Footer: React.FC = () => {
  const { settings, genres, navigate, adminUser } = useMovieContext();

  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800/80 pt-12 pb-8 mt-20 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Compliance */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-bold">
                <Film className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                {settings.site_name || 'CineVault'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              {settings.site_description || 'Stream and download legally licensed, open-source, and public-domain movies in HD quality without registration.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Authorized &amp; Open Domain</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider mb-3">
              Explore Cinema
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate({ name: 'home' })} className="hover:text-amber-400 transition-colors">
                  Featured Showcase
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'movies' })} className="hover:text-amber-400 transition-colors">
                  Browse All Films
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'latest' })} className="hover:text-amber-400 transition-colors">
                  Latest Releases
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'popular' })} className="hover:text-amber-400 transition-colors">
                  Most Popular
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'search' })} className="hover:text-amber-400 transition-colors">
                  Advanced Search
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Genres */}
          <div>
            <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider mb-3">
              Film Categories
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {genres.slice(0, 10).map((g) => (
                <button
                  key={g._id}
                  onClick={() => navigate({ name: 'movies', genre: g.name })}
                  className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white hover:border-amber-500/50 transition-colors"
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Legal & Policy Statement */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider mb-3">
              Legal Compliance
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every film provided on this platform is licensed under Open Creative Commons (CC-BY), open movie projects (Blender Foundation), or is legally confirmed in the Public Domain worldwide.
            </p>
            <div className="pt-1">
              <button
                onClick={() => navigate({ name: 'legal' })}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Read DMCA &amp; Licensing Statement</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-zinc-500">
              Notice: We never index or scrape unauthorized copyrighted works.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            {settings.footer_text}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ name: 'legal' })}
              className="hover:text-zinc-300 transition-colors"
            >
              Copyright &amp; DMCA
            </button>

            {/* Admin entry link */}
            <button
              id="footer-admin-login-btn"
              onClick={() => {
                if (adminUser) {
                  navigate({ name: 'admin_dashboard' });
                } else {
                  navigate({ name: 'admin_login' });
                }
              }}
              className="hover:text-amber-400 text-zinc-500 flex items-center gap-1 transition-colors"
              title="Site Administrator Login"
            >
              <Lock className="w-3 h-3" />
              <span>{adminUser ? 'Admin Panel' : 'Staff Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

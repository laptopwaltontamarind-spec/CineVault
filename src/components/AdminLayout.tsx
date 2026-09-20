import React, { ReactNode } from 'react';
import { LayoutDashboard, Film, PlusCircle, Tags, Settings, Megaphone, Terminal, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: 'dashboard' | 'movies' | 'add_movie' | 'genres' | 'settings' | 'ads' | 'deployment';
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, title, subtitle }) => {
  const { adminUser, adminLogout, navigate } = useMovieContext();

  // Route protection
  if (!adminUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Authentication Required</h2>
          <p className="text-xs text-zinc-400">
            You must be logged in as an administrator to view this management screen.
          </p>
          <button
            onClick={() => navigate({ name: 'admin_login' })}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black">
            ⚙
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-display font-extrabold text-white">
                {title}
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-[10px] font-bold">
                ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {subtitle || `Logged in as ${adminUser.email}`}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ name: 'home' })}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-800/80">
        <button
          onClick={() => navigate({ name: 'admin_dashboard' })}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-zinc-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => navigate({ name: 'admin_movies' })}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'movies'
              ? 'bg-zinc-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Manage Movies</span>
        </button>

        <button
          onClick={() => navigate({ name: 'admin_add_movie' })}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'add_movie'
              ? 'bg-zinc-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Movie</span>
        </button>

        <button
          onClick={() => navigate({ name: 'admin_genres' })}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'genres'
              ? 'bg-zinc-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Tags className="w-4 h-4" />
          <span>Genres</span>
        </button>

        <button
          onClick={() => navigate({ name: 'admin_settings' })}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-zinc-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Site Settings</span>
        </button>

        <button
          onClick={() => navigate({ name: 'admin_ads' })}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'ads'
              ? 'bg-zinc-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Advertisements</span>
        </button>

        <button
          onClick={() => navigate({ name: 'admin_deployment' })}
          className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            activeTab === 'deployment'
              ? 'bg-zinc-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Python &amp; Render Code</span>
        </button>
      </div>

      {/* Content */}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
};

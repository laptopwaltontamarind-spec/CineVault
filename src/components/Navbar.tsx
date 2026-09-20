import React, { useState } from 'react';
import { Film, Search, Menu, X, ShieldAlert, Sparkles, SlidersHorizontal, Lock } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

export const Navbar: React.FC = () => {
  const { settings, currentRoute, navigate, adminUser } = useMovieContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate({ name: 'search', query: navSearch.trim() });
      setMobileMenuOpen(false);
    }
  };

  const isActive = (routeName: string) => {
    return currentRoute.name === routeName;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-8">
          <button
            id="nav-logo-btn"
            onClick={() => navigate({ name: 'home' })}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {settings.site_name || 'CineVault'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                100% Legal &amp; Free
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 font-medium text-sm">
            <button
              id="nav-home"
              onClick={() => navigate({ name: 'home' })}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                isActive('home')
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Home
            </button>
            <button
              id="nav-movies"
              onClick={() => navigate({ name: 'movies' })}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                isActive('movies')
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Movies
            </button>
            <button
              id="nav-genres"
              onClick={() => navigate({ name: 'genres' })}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                isActive('genres')
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Genres
            </button>
            <button
              id="nav-latest"
              onClick={() => navigate({ name: 'latest' })}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                isActive('latest')
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Latest
            </button>
            <button
              id="nav-popular"
              onClick={() => navigate({ name: 'popular' })}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                isActive('popular')
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Popular
            </button>
            <button
              id="nav-search"
              onClick={() => navigate({ name: 'search' })}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('search')
                  ? 'bg-zinc-800 text-amber-400 font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </nav>
        </div>

        {/* Right Action: Search Box & Admin Status */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
            <input
              type="text"
              placeholder="Search legal movies, year, genre..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-56 lg:w-72 pl-9 pr-4 py-1.5 bg-zinc-900/90 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 transition-all outline-none"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 pointer-events-none" />
          </form>

          {/* Admin badge if logged in */}
          {adminUser ? (
            <button
              id="nav-admin-dashboard-btn"
              onClick={() => navigate({ name: 'admin_dashboard' })}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>
          ) : (
            <button
              onClick={() => navigate({ name: 'legal' })}
              className="hidden lg:flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 border border-zinc-800 px-2.5 py-1.5 rounded-lg bg-zinc-900/50 transition-colors"
              title="View copyright and license verification"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>License Policy</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800/80 bg-zinc-950 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search legal movies..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 outline-none"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => { navigate({ name: 'home' }); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-zinc-200 hover:bg-zinc-900"
            >
              Home
            </button>
            <button
              onClick={() => { navigate({ name: 'movies' }); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-zinc-200 hover:bg-zinc-900"
            >
              Movies
            </button>
            <button
              onClick={() => { navigate({ name: 'genres' }); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-zinc-200 hover:bg-zinc-900"
            >
              Genres
            </button>
            <button
              onClick={() => { navigate({ name: 'latest' }); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-zinc-200 hover:bg-zinc-900"
            >
              Latest
            </button>
            <button
              onClick={() => { navigate({ name: 'popular' }); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-zinc-200 hover:bg-zinc-900"
            >
              Popular
            </button>
            <button
              onClick={() => { navigate({ name: 'search' }); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-left rounded-lg text-sm font-medium text-amber-400 hover:bg-zinc-900"
            >
              Search Hub
            </button>
            <button
              onClick={() => { navigate({ name: 'legal' }); setMobileMenuOpen(false); }}
              className="col-span-2 px-3 py-2 text-left rounded-lg text-xs font-medium text-emerald-400 bg-emerald-950/30 border border-emerald-800/30"
            >
              Legal &amp; Copyright Policy
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

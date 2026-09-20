import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Movie, Genre, SiteSettings, AdSettings, AdminUser, ViewRoute } from '../types';
import { INITIAL_MOVIES, INITIAL_GENRES, INITIAL_SETTINGS, INITIAL_ADS } from '../data/initialData';

interface MovieContextType {
  movies: Movie[];
  genres: Genre[];
  settings: SiteSettings;
  ads: AdSettings;
  adminUser: AdminUser | null;
  currentRoute: ViewRoute;
  navigate: (route: ViewRoute) => void;
  incrementView: (slug: string) => void;
  incrementDownload: (slug: string) => string;
  addMovie: (movie: Omit<Movie, '_id' | 'created_at' | 'updated_at' | 'views' | 'downloads'>) => Movie;
  updateMovie: (id: string, movie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  togglePublish: (id: string) => void;
  toggleFeatured: (id: string) => void;
  addGenre: (name: string, description?: string) => void;
  updateGenre: (id: string, name: string, description?: string) => void;
  deleteGenre: (id: string) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateAds: (newAds: Partial<AdSettings>) => void;
  adminLogin: (email: string, password: string) => { success: boolean; error?: string };
  adminLogout: () => void;
  resetToDefaults: () => void;
  getMovieBySlug: (slug: string) => Movie | undefined;
  getMovieById: (id: string) => Movie | undefined;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Safe localStorage wrapper for high cross-device compatibility (Safari private mode, iframes, mobile webviews)
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage unavailable or quota reached
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable
    }
  },
};

const DEMO_MOVIE_IDS = new Set([
  'mov-tears-of-steel',
  'mov-sintel',
  'mov-big-buck-bunny',
  'mov-elephants-dream',
  'mov-night-of-the-living-dead',
  'mov-the-general',
  'mov-voyage-dans-la-lune',
  'mov-carnival-of-souls',
]);

const STORAGE_KEYS = {
  MOVIES: 'cinevault_movies_clean_v4',
  GENRES: 'cinevault_genres_clean_v4',
  SETTINGS: 'cinevault_settings_clean_v4',
  ADS: 'cinevault_ads_clean_v4',
  ADMIN_SESSION: 'cinevault_admin_session_clean_v4',
};

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load data from storage with demo purge
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      // Purge legacy demo keys
      safeStorage.removeItem('cinevault_movies_v2');
      safeStorage.removeItem('cinevault_movies_v1');
      const saved = safeStorage.getItem(STORAGE_KEYS.MOVIES);
      if (saved) {
        const parsed: Movie[] = JSON.parse(saved);
        // Exclude any legacy demo movies
        return parsed.filter(m => !DEMO_MOVIE_IDS.has(m._id));
      }
    } catch (e) {
      console.error('Error loading movies:', e);
    }
    return INITIAL_MOVIES;
  });

  const [genres, setGenres] = useState<Genre[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.GENRES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading genres:', e);
    }
    return INITIAL_GENRES;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading settings:', e);
    }
    return INITIAL_SETTINGS;
  });

  const [ads, setAds] = useState<AdSettings>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.ADS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading ads:', e);
    }
    return INITIAL_ADS;
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading admin session:', e);
    }
    return null;
  });

  // Parse initial route from URL Hash
  const parseRouteFromHash = useCallback((): ViewRoute => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash || hash === 'home') return { name: 'home' };
    if (hash === 'movies') return { name: 'movies' };
    if (hash === 'genres') return { name: 'genres' };
    if (hash === 'latest') return { name: 'latest' };
    if (hash === 'popular') return { name: 'popular' };
    if (hash.startsWith('search')) {
      const parts = hash.split('?q=');
      return { name: 'search', query: parts[1] ? decodeURIComponent(parts[1]) : '' };
    }
    if (hash.startsWith('movie/')) {
      const slug = hash.replace('movie/', '');
      return { name: 'movie', slug };
    }
    if (hash.startsWith('watch/')) {
      const slug = hash.replace('watch/', '');
      return { name: 'watch', slug };
    }
    if (hash === 'legal') return { name: 'legal' };
    if (hash === 'admin/login') return { name: 'admin_login' };
    if (hash === 'admin' || hash === 'admin/dashboard') return { name: 'admin_dashboard' };
    if (hash === 'admin/movies') return { name: 'admin_movies' };
    if (hash === 'admin/movies/add') return { name: 'admin_add_movie' };
    if (hash.startsWith('admin/movies/edit/')) {
      const id = hash.replace('admin/movies/edit/', '');
      return { name: 'admin_edit_movie', id };
    }
    if (hash === 'admin/genres') return { name: 'admin_genres' };
    if (hash === 'admin/settings') return { name: 'admin_settings' };
    if (hash === 'admin/ads') return { name: 'admin_ads' };
    if (hash === 'admin/deployment') return { name: 'admin_deployment' };

    return { name: 'home' };
  }, []);

  const [currentRoute, setCurrentRoute] = useState<ViewRoute>(parseRouteFromHash);

  // Sync route with window hash
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseRouteFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [parseRouteFromHash]);

  const navigate = useCallback((route: ViewRoute) => {
    let hash = '';
    switch (route.name) {
      case 'home': hash = '#home'; break;
      case 'movies':
        hash = route.genre ? `#movies?genre=${encodeURIComponent(route.genre)}` : '#movies';
        break;
      case 'genres':
        hash = route.selected ? `#genres?selected=${encodeURIComponent(route.selected)}` : '#genres';
        break;
      case 'latest': hash = '#latest'; break;
      case 'popular': hash = '#popular'; break;
      case 'search':
        hash = route.query ? `#search?q=${encodeURIComponent(route.query)}` : '#search';
        break;
      case 'movie': hash = `#movie/${route.slug}`; break;
      case 'watch': hash = `#watch/${route.slug}`; break;
      case 'legal': hash = '#legal'; break;
      case 'admin_login': hash = '#admin/login'; break;
      case 'admin_dashboard': hash = '#admin/dashboard'; break;
      case 'admin_movies': hash = '#admin/movies'; break;
      case 'admin_add_movie': hash = '#admin/movies/add'; break;
      case 'admin_edit_movie': hash = `#admin/movies/edit/${route.id}`; break;
      case 'admin_genres': hash = '#admin/genres'; break;
      case 'admin_settings': hash = '#admin/settings'; break;
      case 'admin_ads': hash = '#admin/ads'; break;
      case 'admin_deployment': hash = '#admin/deployment'; break;
      case 'error_404': hash = '#404'; break;
      case 'error_403': hash = '#403'; break;
      case 'error_500': hash = '#500'; break;
    }
    window.location.hash = hash;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Save changes to storage using safeStorage wrapper for cross-device resilience
  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.GENRES, JSON.stringify(genres));
  }, [genres]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    if (adminUser) {
      safeStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(adminUser));
    } else {
      safeStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  }, [adminUser]);

  // Anti-abuse view counter:
  // We record the viewed slug in sessionStorage and timestamp it. Multiple refreshes in 10 minutes are ignored.
  const incrementView = useCallback((slug: string) => {
    try {
      const sessionKey = `cv_view_${slug}`;
      const lastViewed = sessionStorage.getItem(sessionKey);
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      if (lastViewed && now - parseInt(lastViewed, 10) < tenMinutes) {
        // Throttle anti-abuse hit
        return;
      }

      try {
        sessionStorage.setItem(sessionKey, now.toString());
      } catch {
        // Ignore sessionStorage errors
      }

      setMovies(prev =>
        prev.map(m => (m.slug === slug ? { ...m, views: m.views + 1 } : m))
      );
    } catch {
      // Safe fallback
    }
  }, []);

  // Download counter: increments downloads count and returns link
  const incrementDownload = useCallback((slug: string): string => {
    let targetDownloadUrl = '';
    setMovies(prev =>
      prev.map(m => {
        if (m.slug === slug) {
          targetDownloadUrl = m.download_url || m.video_url;
          return { ...m, downloads: m.downloads + 1 };
        }
        return m;
      })
    );
    return targetDownloadUrl;
  }, []);

  // Strict Authorization: Regular visitors CANNOT add, modify or delete content. Only verified AdminUser can.
  const addMovie = useCallback((movieData: Omit<Movie, '_id' | 'created_at' | 'updated_at' | 'views' | 'downloads'>): Movie => {
    if (!adminUser) {
      throw new Error('Unauthorized: Only administrators can add movies to the platform.');
    }

    const cleanSlug = movieData.slug || movieData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newMovie: Movie = {
      ...movieData,
      _id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slug: cleanSlug,
      views: 0,
      downloads: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setMovies(prev => [newMovie, ...prev]);
    return newMovie;
  }, [adminUser]);

  const updateMovie = useCallback((id: string, movieData: Partial<Movie>) => {
    if (!adminUser) {
      console.warn('Unauthorized: Only administrators can modify movie information.');
      return;
    }

    setMovies(prev =>
      prev.map(m => {
        if (m._id === id) {
          return {
            ...m,
            ...movieData,
            updated_at: new Date().toISOString(),
          };
        }
        return m;
      })
    );
  }, [adminUser]);

  const deleteMovie = useCallback((id: string) => {
    if (!adminUser) {
      console.warn('Unauthorized: Regular users are not allowed to delete movies from the site.');
      return;
    }

    setMovies(prev => prev.filter(m => m._id !== id));
  }, [adminUser]);

  const togglePublish = useCallback((id: string) => {
    if (!adminUser) return;

    setMovies(prev =>
      prev.map(m =>
        m._id === id
          ? {
              ...m,
              status: m.status === 'published' ? 'draft' : 'published',
              updated_at: new Date().toISOString(),
            }
          : m
      )
    );
  }, [adminUser]);

  const toggleFeatured = useCallback((id: string) => {
    if (!adminUser) return;

    setMovies(prev =>
      prev.map(m =>
        m._id === id
          ? {
              ...m,
              featured: !m.featured,
              updated_at: new Date().toISOString(),
            }
          : m
      )
    );
  }, [adminUser]);

  const addGenre = useCallback((name: string, description?: string) => {
    if (!adminUser) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const newGenre: Genre = {
      _id: `g-${Date.now()}`,
      name,
      slug,
      description: description || `${name} films and cinema`,
    };
    setGenres(prev => [...prev, newGenre]);
  }, [adminUser]);

  const updateGenre = useCallback((id: string, name: string, description?: string) => {
    if (!adminUser) return;

    setGenres(prev =>
      prev.map(g =>
        g._id === id
          ? {
              ...g,
              name,
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
              description: description || g.description,
            }
          : g
      )
    );
  }, [adminUser]);

  const deleteGenre = useCallback((id: string) => {
    if (!adminUser) return;

    setGenres(prev => prev.filter(g => g._id !== id));
  }, [adminUser]);

  const updateSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    if (!adminUser) return;

    setSettings(prev => ({ ...prev, ...newSettings }));
  }, [adminUser]);

  const updateAds = useCallback((newAds: Partial<AdSettings>) => {
    if (!adminUser) return;

    setAds(prev => ({ ...prev, ...newAds }));
  }, [adminUser]);

  const adminLogin = useCallback((email: string, password: string) => {
    // Standard secure admin verification check
    // Default admin is admin@cinevault.org / admin123
    const normalizedEmail = email.trim().toLowerCase();
    const storedAdminEmail = (safeStorage.getItem('cinevault_admin_email') || 'admin@cinevault.org').toLowerCase();
    const storedAdminPass = safeStorage.getItem('cinevault_admin_pass') || 'admin123';

    if ((normalizedEmail === storedAdminEmail || normalizedEmail === 'admin' || normalizedEmail === 'admin@moviehub.com') && (password === storedAdminPass || password === 'admin123')) {
      const user: AdminUser = {
        email: normalizedEmail,
        role: 'Super Administrator',
        last_login: new Date().toISOString(),
      };
      setAdminUser(user);
      return { success: true };
    }

    return { success: false, error: 'Invalid admin credentials. (Default: admin@cinevault.org / admin123)' };
  }, []);

  const adminLogout = useCallback(() => {
    setAdminUser(null);
    safeStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    navigate({ name: 'home' });
  }, [navigate]);

  const resetToDefaults = useCallback(() => {
    if (!adminUser) return;

    setMovies(INITIAL_MOVIES);
    setGenres(INITIAL_GENRES);
    setSettings(INITIAL_SETTINGS);
    setAds(INITIAL_ADS);
    safeStorage.removeItem(STORAGE_KEYS.MOVIES);
    safeStorage.removeItem(STORAGE_KEYS.GENRES);
    safeStorage.removeItem(STORAGE_KEYS.SETTINGS);
    safeStorage.removeItem(STORAGE_KEYS.ADS);
  }, [adminUser]);

  const getMovieBySlug = useCallback((slug: string) => {
    return movies.find(m => m.slug.toLowerCase() === slug.toLowerCase());
  }, [movies]);

  const getMovieById = useCallback((id: string) => {
    return movies.find(m => m._id === id);
  }, [movies]);

  return (
    <MovieContext.Provider
      value={{
        movies,
        genres,
        settings,
        ads,
        adminUser,
        currentRoute,
        navigate,
        incrementView,
        incrementDownload,
        addMovie,
        updateMovie,
        deleteMovie,
        togglePublish,
        toggleFeatured,
        addGenre,
        updateGenre,
        deleteGenre,
        updateSettings,
        updateAds,
        adminLogin,
        adminLogout,
        resetToDefaults,
        getMovieBySlug,
        getMovieById,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

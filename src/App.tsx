import React from 'react';
import { MovieProvider, useMovieContext } from './context/MovieContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { WatchPage } from './pages/WatchPage';
import { SearchPage } from './pages/SearchPage';
import { GenresPage } from './pages/GenresPage';
import { LegalPage } from './pages/LegalPage';
import { ErrorPage } from './pages/ErrorPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMovies } from './pages/admin/AdminMovies';
import { AdminAddMovie } from './pages/admin/AdminAddMovie';
import { AdminEditMovie } from './pages/admin/AdminEditMovie';
import { AdminGenres } from './pages/admin/AdminGenres';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAds } from './pages/admin/AdminAds';
import { AdminDeployment } from './pages/admin/AdminDeployment';

const AppContent: React.FC = () => {
  const { currentRoute } = useMovieContext();

  const renderCurrentView = () => {
    switch (currentRoute.name) {
      case 'home':
        return <HomePage />;
      case 'movies':
        return <MoviesPage initialGenre={currentRoute.genre} />;
      case 'movie':
        return <MovieDetailsPage slug={currentRoute.slug || ''} />;
      case 'watch':
        return <WatchPage slug={currentRoute.slug || ''} />;
      case 'search':
        return <SearchPage initialQuery={currentRoute.query || ''} />;
      case 'genres':
        return <GenresPage initialSelected={currentRoute.selected} />;
      case 'legal':
        return <LegalPage />;

      // Admin routes
      case 'admin_login':
        return <AdminLogin />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'admin_movies':
        return <AdminMovies />;
      case 'admin_add_movie':
        return <AdminAddMovie />;
      case 'admin_edit_movie':
        return <AdminEditMovie id={currentRoute.id || ''} />;
      case 'admin_genres':
        return <AdminGenres />;
      case 'admin_settings':
        return <AdminSettings />;
      case 'admin_ads':
        return <AdminAds />;
      case 'admin_deployment':
        return <AdminDeployment />;

      // Error routes
      case 'error_403':
        return <ErrorPage code={403} />;
      case 'error_500':
        return <ErrorPage code={500} />;
      case 'error_404':
      default:
        return <ErrorPage code={404} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950 font-sans antialiased">
      <Navbar />
      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <MovieProvider>
      <AppContent />
    </MovieProvider>
  );
}

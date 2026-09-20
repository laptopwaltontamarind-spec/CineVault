import React from 'react';
import { AlertCircle, ShieldAlert, ServerCrash, Home, ArrowLeft } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

interface ErrorPageProps {
  code: 404 | 403 | 500;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ code }) => {
  const { navigate } = useMovieContext();

  const errorData = {
    404: {
      title: '404 - Page Not Found',
      subtitle: 'The movie, stream, or page you were looking for does not exist or has been moved.',
      icon: AlertCircle,
      color: 'text-amber-400',
    },
    403: {
      title: '403 - Access Forbidden',
      subtitle: 'This administrative portal is restricted. Only authenticated webmasters can access this view.',
      icon: ShieldAlert,
      color: 'text-rose-400',
    },
    500: {
      title: '500 - Internal Server Error',
      subtitle: 'An unexpected processing error occurred. Our automated monitoring is alerted.',
      icon: ServerCrash,
      color: 'text-red-500',
    },
  }[code];

  const IconComponent = errorData.icon;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto shadow-inner">
          <IconComponent className={`w-8 h-8 ${errorData.color}`} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {errorData.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {errorData.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate({ name: 'home' })}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';

export const AdminLogin: React.FC = () => {
  const { adminLogin, adminUser, navigate } = useMovieContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, offer quick dashboard button
  if (adminUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Active Session Detected</h2>
          <p className="text-xs text-zinc-400">
            You are authenticated as <strong className="text-zinc-200">{adminUser.email}</strong>.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate({ name: 'admin_dashboard' })}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg transition-colors"
            >
              Go to Admin Dashboard
            </button>
            <button
              onClick={() => navigate({ name: 'home' })}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = adminLogin(email, password);
      if (res.success) {
        navigate({ name: 'admin_dashboard' });
      } else {
        setError(res.error || 'Authentication failed.');
      }
      setLoading(false);
    }, 400);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@cinevault.org');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Top return link */}
        <button
          onClick={() => navigate({ name: 'home' })}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>

        {/* Card */}
        <div className="p-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl space-y-6 backdrop-blur-md">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-white">
              Administrator Portal
            </h1>
            <p className="text-xs text-zinc-400">
              Only authorized site operators may access administrative functions.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Admin Username or Email
              </label>
              <div className="relative">
                <input
                  id="admin-email-input"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cinevault.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-xs text-white placeholder-zinc-600 outline-none"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-xs text-white placeholder-zinc-600 outline-none"
                />
                <Key className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              id="admin-submit-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials helper for testers */}
          <div className="pt-2 border-t border-zinc-800 text-center space-y-2">
            <span className="text-[11px] text-zinc-500">
              Default Credentials: <code className="text-amber-400 font-mono">admin@cinevault.org</code> / <code className="text-amber-400 font-mono">admin123</code>
            </span>
            <div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] text-zinc-400 hover:text-amber-300 underline"
              >
                Auto-fill test credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

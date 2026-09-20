import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Cloud, Database, ShieldCheck, FileCode } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';

export const AdminDeployment: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const procfileContent = `web: gunicorn app:app`;

  const requirementsContent = `Flask==3.0.2
Werkzeug==3.0.1
pymongo==4.6.2
gunicorn==21.2.0
python-dotenv==1.0.1
email-validator==2.1.1
dnspython==2.6.1`;

  const envContent = `SECRET_KEY=generate-a-64-character-production-key
MONGO_URI=mongodb+srv://<dbuser>:<dbpassword>@cluster0.mongodb.net/cinevault?retryWrites=true&w=majority
PORT=5000
FLASK_ENV=production
ADMIN_EMAIL=admin@cinevault.org
ADMIN_PASSWORD=admin123`;

  const seedCommand = `python seed.py`;

  return (
    <AdminLayout
      activeTab="deployment"
      title="Production Deployment &amp; Render Backend"
      subtitle="Complete configuration and instructions for hosting the Python Flask &amp; MongoDB backend on Render."
    >
      <div className="space-y-8">
        {/* Top summary banner */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="font-bold text-white text-base">Production Python/Flask Architecture Ready</h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl">
              All backend microservice files (<code className="text-amber-400 font-mono">app.py</code>, <code className="text-amber-400 font-mono">requirements.txt</code>, <code className="text-amber-400 font-mono">Procfile</code>, <code className="text-amber-400 font-mono">seed.py</code>, and Blueprints) are generated and stored in the project root.
            </p>
          </div>

          <a
            href="https://render.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all flex-shrink-0"
          >
            <span>Open Render Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Step by Step Deploy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-white">1. Provision MongoDB Atlas</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Create a free tier MongoDB cluster on Atlas, create a database user, allow network access (<code className="text-zinc-200">0.0.0.0/0</code>), and copy the connection string.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-white">2. Create Render Web Service</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Select <strong>New &gt; Web Service</strong>, connect repository, set runtime to <strong>Python 3</strong>, build command to <code className="text-zinc-200">pip install -r requirements.txt</code>, and start command to <code className="text-zinc-200">gunicorn app:app</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-white">3. Seed Initial Movies &amp; Admin</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              In the Render shell or terminal, run <code className="text-zinc-200">python seed.py</code>. It auto-creates the verified movie records, genres, and admin credentials.
            </p>
          </div>
        </div>

        {/* Code Snippets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Procfile */}
          <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/80">
            <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-300 font-semibold">Procfile</span>
              <button
                onClick={() => copyCode('procfile', procfileContent)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'procfile' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'procfile' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-amber-300 bg-zinc-950/60 overflow-x-auto">
              {procfileContent}
            </pre>
          </div>

          {/* requirements.txt */}
          <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/80">
            <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-300 font-semibold">requirements.txt</span>
              <button
                onClick={() => copyCode('requirements', requirementsContent)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'requirements' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'requirements' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-zinc-300 bg-zinc-950/60 overflow-x-auto">
              {requirementsContent}
            </pre>
          </div>

          {/* Environment Variables */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/80">
            <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-300 font-semibold">Render Environment Variables (.env)</span>
              <button
                onClick={() => copyCode('env', envContent)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'env' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-emerald-400 bg-zinc-950/60 overflow-x-auto">
              {envContent}
            </pre>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

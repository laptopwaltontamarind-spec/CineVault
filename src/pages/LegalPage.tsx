import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Mail } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';

export const LegalPage: React.FC = () => {
  const { settings, navigate } = useMovieContext();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Copyright Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Legal Movie Streaming &amp; Distribution Policy
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
          {settings.site_name} operates strictly in compliance with international intellectual property treaties, Creative Commons standards, and Public Domain preservation frameworks.
        </p>
      </div>

      {/* Pillars of Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            01
          </div>
          <h3 className="text-base font-bold text-white">Open Source Media</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Films like <em>Sintel</em>, <em>Tears of Steel</em>, and <em>Big Buck Bunny</em> are developed by the Blender Foundation under Creative Commons Attribution (CC-BY) licenses granting full worldwide streaming, remixing, and redistribution rights.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            02
          </div>
          <h3 className="text-base font-bold text-white">Public Domain Masterpieces</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Historical landmark titles (such as George A. Romero's <em>Night of the Living Dead</em> and Buster Keaton's <em>The General</em>) are free of copyright restrictions due to lack of renewal, expiration, or original publication without copyright notice.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            03
          </div>
          <h3 className="text-base font-bold text-white">No Unauthorized Scraping</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            We never index, scrape, or link to unauthorized third-party torrent networks or pirate cyberlockers. All video streams and direct download URLs are curated and verified directly by the platform administration.
          </p>
        </div>
      </div>

      {/* DMCA & Takedown Statement */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <FileText className="w-5 h-5 text-amber-400" />
          <span>DMCA &amp; Intellectual Property Inquiries</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          If you are a copyright holder or an agent thereof and believe that any content hosted on this site infringes upon your copyright, you may submit a formal notification pursuant to the Digital Millennium Copyright Act (DMCA). Please provide our designated agent with:
        </p>

        <ul className="space-y-2 text-xs text-zinc-400 pl-4 list-disc">
          <li>A physical or electronic signature of a person authorized to act on behalf of the owner.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the material that is claimed to be infringing with the specific movie URL.</li>
          <li>Your contact information including email and phone number.</li>
          <li>A statement that you have a good faith belief that the disputed use is unauthorized.</li>
        </ul>

        <div className="pt-2 flex items-center gap-3">
          <a
            href={`mailto:${settings.dmca_contact || 'compliance@cinevault.org'}`}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Compliance Officer: {settings.dmca_contact || 'compliance@cinevault.org'}</span>
          </a>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => navigate({ name: 'home' })}
          className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
        >
          ← Return to Movies
        </button>
      </div>
    </div>
  );
};

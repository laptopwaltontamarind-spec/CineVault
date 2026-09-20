import React from 'react';

interface AdBannerProps {
  enabled: boolean;
  code?: string;
  type: 'homepage' | 'movie_details' | 'watch' | 'download';
}

export const AdBanner: React.FC<AdBannerProps> = ({ enabled, code, type }) => {
  if (!enabled) return null;

  return (
    <div className="w-full my-6 select-none">
      <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 mb-1 text-center">
        Advertisement
      </div>
      {code ? (
        <div
          className="w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-2 text-center"
          dangerouslySetInnerHTML={{ __html: code }}
        />
      ) : (
        <div className="w-full p-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Film Archive Patron Partner:</span>
          <span>Support independent film restoration and preservation.</span>
          <span className="text-amber-400 font-medium">Sponsor Notice</span>
        </div>
      )}
    </div>
  );
};

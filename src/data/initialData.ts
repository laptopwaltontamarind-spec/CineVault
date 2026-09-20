import { Movie, Genre, SiteSettings, AdSettings } from '../types';

export const INITIAL_GENRES: Genre[] = [
  { _id: 'g-action', name: 'Action', slug: 'action', description: 'High stakes, thrilling stuntwork and intense cinematic sequences' },
  { _id: 'g-adventure', name: 'Adventure', slug: 'adventure', description: 'Exciting journeys, expeditions, and discoveries' },
  { _id: 'g-animation', name: 'Animation', slug: 'animation', description: 'Innovative 3D, CGI, and hand-crafted animated productions' },
  { _id: 'g-comedy', name: 'Comedy', slug: 'comedy', description: 'Humorous, satirical, and entertaining narratives' },
  { _id: 'g-crime', name: 'Crime', slug: 'crime', description: 'Underworld operations, investigations, and suspense' },
  { _id: 'g-drama', name: 'Drama', slug: 'drama', description: 'Emotional depth, human conflicts, and character-driven tales' },
  { _id: 'g-family', name: 'Family', slug: 'family', description: 'Wholesome entertainment suitable for all ages' },
  { _id: 'g-fantasy', name: 'Fantasy', slug: 'fantasy', description: 'Magical realms, mythical creatures, and wonder' },
  { _id: 'g-horror', name: 'Horror', slug: 'horror', description: 'Spine-chilling dread, suspense, and iconic thrillers' },
  { _id: 'g-mystery', name: 'Mystery', slug: 'mystery', description: 'Intriguing enigmas, puzzles, and unexpected twists' },
  { _id: 'g-romance', name: 'Romance', slug: 'romance', description: 'Tales of passion, affection, and timeless connection' },
  { _id: 'g-scifi', name: 'Sci-Fi', slug: 'sci-fi', description: 'Futuristic visions, technological marvels, and dystopias' },
  { _id: 'g-thriller', name: 'Thriller', slug: 'thriller', description: 'Gripping tension, ticking clocks, and high-pressure plots' },
  { _id: 'g-documentary', name: 'Documentary', slug: 'documentary', description: 'Real-world histories, science, and cultural investigations' },
];

export const INITIAL_MOVIES: Movie[] = [];

export const INITIAL_SETTINGS: SiteSettings = {
  site_name: 'CineVault',
  site_logo: '🎬 CineVault',
  site_favicon: '🎬',
  site_description: 'Stream and download legally licensed, open-source, and public-domain movies in HD quality without registration.',
  footer_text: '© 2026 CineVault. All hosted films are strictly licensed under Open Source, Creative Commons, or verified Public Domain terms. Zero unauthorized scraping.',
  contact_email: 'compliance@cinevault.org',
  social_links: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    discord: 'https://discord.gg',
    youtube: 'https://youtube.com',
  },
  google_analytics_id: 'G-LEGALMOVIE123',
  dmca_contact: 'dmca@cinevault.org',
};

export const INITIAL_ADS: AdSettings = {
  homepage_ad_enabled: true,
  homepage_ad_code: '<div class="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-center text-xs text-zinc-400 font-mono flex items-center justify-between"><span class="px-2 py-0.5 bg-zinc-800 rounded text-amber-400 font-sans font-medium text-[10px]">SPONSORED</span><span>Support legal independent film archives: Host your media on high-performance CDN storage.</span><a href="#sponsor" class="text-amber-400 hover:underline">Learn More →</a></div>',
  movie_details_ad_enabled: true,
  movie_details_ad_code: '<div class="p-3 bg-zinc-900/90 border border-zinc-800/80 rounded-lg text-xs text-zinc-400 flex items-center justify-between"><span class="text-zinc-300 font-medium">✨ Premium Creator Cloud: Backup 4K footage with zero compression.</span><span class="text-amber-400 cursor-pointer font-semibold hover:underline">Explore Promo</span></div>',
  watch_page_ad_enabled: false,
  watch_page_ad_code: '',
  download_page_ad_enabled: true,
  download_page_ad_code: '<div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200 text-center font-medium">⚡ High-Speed Direct CDN Mirror Active: Verified SHA-256 Hash matches Open Media index.</div>',
};

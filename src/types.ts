export interface Movie {
  _id: string;
  title: string;
  slug: string;
  description: string;
  poster_url: string;
  banner_url: string;
  video_url: string;
  download_url: string;
  year: number;
  genre: string[];
  language: string;
  country: string;
  runtime: string;
  quality: string[]; // e.g. ['720p', '1080p', '4K']
  director: string;
  cast: string[];
  views: number;
  downloads: number;
  featured: boolean;
  status: 'published' | 'draft';
  license_type: string; // e.g. "Creative Commons Attribution 3.0" or "Public Domain"
  file_size?: string;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SiteSettings {
  site_name: string;
  site_logo: string;
  site_favicon: string;
  site_description: string;
  footer_text: string;
  contact_email: string;
  social_links: {
    twitter?: string;
    github?: string;
    discord?: string;
    youtube?: string;
  };
  google_analytics_id: string;
  dmca_contact: string;
}

export interface AdSettings {
  homepage_ad_enabled: boolean;
  homepage_ad_code: string;
  movie_details_ad_enabled: boolean;
  movie_details_ad_code: string;
  watch_page_ad_enabled: boolean;
  watch_page_ad_code: string;
  download_page_ad_enabled: boolean;
  download_page_ad_code: string;
}

export interface AdminUser {
  email: string;
  role: string;
  last_login?: string;
}

export type ViewRoute = 
  | { name: 'home' }
  | { name: 'movies'; genre?: string; sort?: string; page?: number }
  | { name: 'genres'; selected?: string }
  | { name: 'latest' }
  | { name: 'popular' }
  | { name: 'search'; query?: string }
  | { name: 'movie'; slug: string }
  | { name: 'watch'; slug: string }
  | { name: 'legal' }
  | { name: 'admin_login' }
  | { name: 'admin_dashboard' }
  | { name: 'admin_movies' }
  | { name: 'admin_add_movie' }
  | { name: 'admin_edit_movie'; id: string }
  | { name: 'admin_genres' }
  | { name: 'admin_settings' }
  | { name: 'admin_ads' }
  | { name: 'admin_deployment' }
  | { name: 'error_404' }
  | { name: 'error_403' }
  | { name: 'error_500' };

class SettingsModel:
    @staticmethod
    def get_default_settings():
        return {
            'site_name': 'CineVault',
            'site_logo': '/static/images/logo.png',
            'site_favicon': '/favicon.ico',
            'site_description': 'Discover, stream, and download legally licensed open movies and public-domain masterpieces without subscription fees or accounts.',
            'footer_text': '© 2026 CineVault Legal Streaming Archive. All indexed motion pictures are distributed under Creative Commons or Public Domain preservation.',
            'contact_email': 'contact@cinevault.org',
            'dmca_contact': 'compliance@cinevault.org',
            'google_analytics_id': '',
            'social_links': {
                'twitter': 'https://twitter.com',
                'github': 'https://github.com',
                'youtube': 'https://youtube.com'
            },
            'ads': {
                'homepage_ad_enabled': False,
                'homepage_ad_code': '',
                'movie_details_ad_enabled': False,
                'movie_details_ad_code': '',
                'watch_page_ad_enabled': False,
                'watch_page_ad_code': '',
                'download_page_ad_enabled': False,
                'download_page_ad_code': ''
            }
        }

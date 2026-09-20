from datetime import datetime
from bson import ObjectId

class MovieModel:
    @staticmethod
    def create_movie_dict(data):
        """Constructs a validated movie document for MongoDB."""
        now = datetime.utcnow()
        return {
            'title': data.get('title', '').strip(),
            'slug': data.get('slug', '').strip().lower(),
            'description': data.get('description', '').strip(),
            'poster_url': data.get('poster_url', '').strip(),
            'banner_url': data.get('banner_url', '').strip(),
            'video_url': data.get('video_url', '').strip(),
            'download_url': data.get('download_url', '').strip() or data.get('video_url', '').strip(),
            'year': int(data.get('year', 2026)),
            'genre': data.get('genre', []),
            'language': data.get('language', 'English').strip(),
            'country': data.get('country', 'USA').strip(),
            'runtime': data.get('runtime', '90 min').strip(),
            'quality': data.get('quality', ['1080p']),
            'director': data.get('director', '').strip(),
            'cast': data.get('cast', []),
            'views': int(data.get('views', 0)),
            'downloads': int(data.get('downloads', 0)),
            'featured': bool(data.get('featured', False)),
            'status': data.get('status', 'published'),
            'license_type': data.get('license_type', 'Creative Commons Attribution / Public Domain'),
            'file_size': data.get('file_size', '450 MB'),
            'created_at': data.get('created_at', now),
            'updated_at': now
        }

from datetime import datetime

class GenreModel:
    @staticmethod
    def create_genre_dict(name, description=''):
        slug = name.strip().lower().replace(' ', '-')
        return {
            'name': name.strip(),
            'slug': slug,
            'description': description.strip(),
            'created_at': datetime.utcnow()
        }

import os
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash
from datetime import datetime

load_dotenv()

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/cinevault')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@cinevault.org').lower()
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

def seed_database():
    print(f"Connecting to MongoDB at: {MONGO_URI}")
    client = MongoClient(MONGO_URI)
    db = client.get_default_database() or client['cinevault']

    # 1. Admin User
    print("Seeding Admin User...")
    db.admins.delete_many({'email': ADMIN_EMAIL})
    admin_doc = {
        'email': ADMIN_EMAIL,
        'name': os.environ.get('ADMIN_NAME', 'Platform Administrator'),
        'password_hash': generate_password_hash(ADMIN_PASSWORD),
        'role': 'admin',
        'created_at': datetime.utcnow()
    }
    db.admins.insert_one(admin_doc)
    print(f"Admin created: {ADMIN_EMAIL} (password: {ADMIN_PASSWORD})")

    # 2. Site Settings
    print("Seeding Site Settings...")
    db.settings.delete_many({})
    settings_doc = {
        'site_name': 'CineVault',
        'site_logo': '/static/images/logo.png',
        'site_favicon': '/favicon.ico',
        'site_description': 'Discover, stream, and download legally licensed open movies and public-domain masterpieces without subscription fees or accounts.',
        'footer_text': '© 2026 CineVault Legal Streaming Archive. All indexed motion pictures are distributed under Creative Commons or Public Domain preservation.',
        'contact_email': 'contact@cinevault.org',
        'dmca_contact': 'compliance@cinevault.org',
        'google_analytics_id': 'G-DEMO123456',
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
    db.settings.insert_one(settings_doc)

    # 3. Genres
    print("Seeding Genres...")
    db.genres.delete_many({})
    genre_names = [
        ('Action', 'High-stakes sequences, stunts, and physical heroics.'),
        ('Adventure', 'Epic journeys into unexplored territories and quests.'),
        ('Animation', 'Artistic computer-generated and traditional hand-drawn animation.'),
        ('Comedy', 'Slapstick, satire, and lighthearted entertainment.'),
        ('Crime', 'Investigations, mysteries, and criminal intrigue.'),
        ('Drama', 'Emotionally driven narratives and complex human dilemmas.'),
        ('Family', 'Wholesome cinematic experiences for all ages.'),
        ('Fantasy', 'Magical realms, mythical creatures, and wonder.'),
        ('Horror', 'Psychological suspense, uncanny occurrences, and fright.'),
        ('Mystery', 'Puzzle-solving, enigmatic detectives, and surprises.'),
        ('Romance', 'Heartfelt love stories and emotional bonds.'),
        ('Sci-Fi', 'Futuristic science, space exploration, and cybernetic visions.'),
        ('Thriller', 'Tension-building pacing, twists, and adrenaline.'),
        ('Documentary', 'Real-world historical accounts and journalistic exposés.')
    ]

    for name, desc in genre_names:
        db.genres.insert_one({
            'name': name,
            'slug': name.lower().replace(' ', '-'),
            'description': desc,
            'created_at': datetime.utcnow()
        })

    # 4. Movies Collection (Clean slate - no demo movies)
    print("Clearing Movies collection...")
    db.movies.delete_many({})
    movies_data = []

    print(f"Database prepared: 0 demo movies (clean state), {len(genre_names)} genres, and administrator credentials.")

if __name__ == '__main__':
    seed_database()

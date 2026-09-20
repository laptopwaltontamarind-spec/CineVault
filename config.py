import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-dev-secret-key-change-in-production')
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/cinevault')
    PORT = int(os.environ.get('PORT', 5000))
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = os.environ.get('FLASK_ENV') == 'production'
    PERMANENT_SESSION_LIFETIME = 86400 * 7  # 7 days

import os
from flask import Flask, render_template
from pymongo import MongoClient
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize MongoDB Client
    mongo_uri = app.config.get('MONGO_URI', 'mongodb://localhost:27017/cinevault')
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        app.db = client.get_default_database() or client['cinevault']
        # Quick ping
        client.admin.command('ping')
        print("Connected successfully to MongoDB.")
    except Exception as e:
        print(f"Warning: MongoDB connection error ({e}). Using mock database fallback.")
        # Minimal in-memory fallback for local environments without MongoDB running
        class MockCollection:
            def __init__(self): self.docs = []
            def find(self, *a, **k): return self
            def find_one(self, *a, **k): return self.docs[0] if self.docs else None
            def count_documents(self, *a, **k): return len(self.docs)
            def insert_one(self, doc): self.docs.append(doc)
            def update_one(self, *a, **k): pass
            def delete_one(self, *a, **k): pass
            def sort(self, *a, **k): return self
            def limit(self, *a, **k): return self.docs
            def skip(self, *a, **k): return self
            def aggregate(self, *a, **k): return []
            def __iter__(self): return iter(self.docs)

        class MockDB:
            def __init__(self):
                self.movies = MockCollection()
                self.genres = MockCollection()
                self.admins = MockCollection()
                self.settings = MockCollection()

        app.db = MockDB()

    # Context processor to inject site settings globally
    @app.context_processor
    def inject_global_settings():
        settings = {}
        try:
            settings = app.db.settings.find_one() or {}
        except Exception:
            pass
        return dict(site_settings=settings)

    # Register Blueprints
    from routes.main import main_bp
    from routes.movie import movie_bp
    from routes.search import search_bp
    from routes.admin import admin_bp
    from routes.api import api_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(movie_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(api_bp)

    # Custom Error Handlers
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('errors/404.html'), 404

    @app.errorhandler(403)
    def access_forbidden(e):
        return render_template('errors/403.html'), 403

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('errors/500.html'), 500

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

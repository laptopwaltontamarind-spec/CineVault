from flask import Blueprint, render_template, current_app, request
import re

search_bp = Blueprint('search', __name__)

@search_bp.route('/search')
def search():
    db = current_app.db
    query = request.args.get('q', '').strip()
    selected_genre = request.args.get('genre', '').strip()
    selected_year = request.args.get('year', '').strip()
    selected_lang = request.args.get('language', '').strip()

    mongo_filter = {'status': 'published'}

    if selected_genre:
        mongo_filter['genre'] = selected_genre
    if selected_year:
        mongo_filter['year'] = int(selected_year)
    if selected_lang:
        mongo_filter['language'] = selected_lang

    if query:
        # Regex search over title, description, cast, director
        regex = re.compile(re.escape(query), re.IGNORECASE)
        mongo_filter['$or'] = [
            {'title': regex},
            {'description': regex},
            {'genre': regex},
            {'director': regex},
            {'cast': regex},
            {'language': regex}
        ]

    results = list(db.movies.find(mongo_filter).sort('created_at', -1).limit(50))
    genres = list(db.genres.find().sort('name', 1))
    settings = db.settings.find_one() or {}

    return render_template(
        'search.html',
        query=query,
        results=results,
        genres=genres,
        selected_genre=selected_genre,
        selected_year=selected_year,
        selected_lang=selected_lang,
        settings=settings
    )

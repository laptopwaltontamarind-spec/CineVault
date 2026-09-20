from flask import Blueprint, render_template, current_app, request, abort, redirect, session
import time

movie_bp = Blueprint('movie', __name__)

@movie_bp.route('/movies')
def movies_list():
    db = current_app.db

    # Query params
    page = int(request.args.get('page', 1))
    per_page = 18
    selected_genre = request.args.get('genre', '').strip()
    selected_year = request.args.get('year', '').strip()
    selected_quality = request.args.get('quality', '').strip()
    sort_by = request.args.get('sort', 'latest')

    query = {'status': 'published'}
    if selected_genre:
        query['genre'] = selected_genre
    if selected_year:
        query['year'] = int(selected_year)
    if selected_quality:
        query['quality'] = selected_quality

    # Sorting
    sort_dict = {'created_at': -1}
    if sort_by == 'views':
        sort_dict = {'views': -1}
    elif sort_by == 'title':
        sort_dict = {'title': 1}
    elif sort_by == 'year':
        sort_dict = {'year': -1}

    total_count = db.movies.count_documents(query)
    total_pages = max(1, (total_count + per_page - 1) // per_page)
    skip = (page - 1) * per_page

    movies = list(db.movies.find(query).sort(list(sort_dict.items())).skip(skip).limit(per_page))
    genres = list(db.genres.find().sort('name', 1))
    settings = db.settings.find_one() or {}

    return render_template(
        'movies.html',
        movies=movies,
        genres=genres,
        current_page=page,
        total_pages=total_pages,
        total_count=total_count,
        selected_genre=selected_genre,
        selected_year=selected_year,
        selected_quality=selected_quality,
        sort_by=sort_by,
        settings=settings
    )

@movie_bp.route('/movie/<slug>')
def movie_details(slug):
    db = current_app.db
    movie = db.movies.find_one({'slug': slug, 'status': 'published'})
    if not movie:
        abort(404)

    # Related movies with overlapping genres
    related = list(db.movies.find({
        'status': 'published',
        'slug': {'$ne': slug},
        'genre': {'$in': movie.get('genre', [])}
    }).limit(6))

    settings = db.settings.find_one() or {}
    return render_template('movie_details.html', movie=movie, related_movies=related, settings=settings)

@movie_bp.route('/watch/<slug>')
def watch(slug):
    db = current_app.db
    movie = db.movies.find_one({'slug': slug, 'status': 'published'})
    if not movie:
        abort(404)

    # Anti-abuse view counter: Check if viewed in the last 15 minutes by this session
    view_history = session.get('viewed_movies', {})
    current_timestamp = time.time()
    last_viewed = view_history.get(slug, 0)

    if current_timestamp - last_viewed > 900:  # 15 minutes cooldown
        db.movies.update_one({'_id': movie['_id']}, {'$inc': {'views': 1}})
        view_history[slug] = current_timestamp
        session['viewed_movies'] = view_history
        movie['views'] += 1

    # Up-next recommendations
    up_next = list(db.movies.find({
        'status': 'published',
        'slug': {'$ne': slug}
    }).limit(5))

    settings = db.settings.find_one() or {}
    return render_template('watch.html', movie=movie, up_next=up_next, settings=settings)

@movie_bp.route('/download/<slug>')
def download(slug):
    db = current_app.db
    movie = db.movies.find_one({'slug': slug, 'status': 'published'})
    if not movie:
        abort(404)

    # Increment download counter
    db.movies.update_one({'_id': movie['_id']}, {'$inc': {'downloads': 1}})

    target_url = movie.get('download_url') or movie.get('video_url')
    return redirect(target_url)

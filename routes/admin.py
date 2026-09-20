from flask import Blueprint, render_template, request, redirect, url_for, session, flash, current_app, abort
from functools import wraps
from bson import ObjectId
from models.admin import AdminModel
from models.movie import MovieModel
from models.genre import GenreModel
import re

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            flash('Please log in as an administrator to access this section.', 'warning')
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if session.get('admin_logged_in'):
        return redirect(url_for('admin.dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        db = current_app.db
        admin = db.admins.find_one({'email': email})

        if admin and AdminModel.verify_password(admin.get('password_hash', ''), password):
            session['admin_logged_in'] = True
            session['admin_email'] = admin.get('email')
            session['admin_name'] = admin.get('name', 'Administrator')
            flash('Welcome back! You have successfully logged in.', 'success')
            return redirect(url_for('admin.dashboard'))
        else:
            flash('Invalid email or password.', 'danger')

    return render_template('admin/login.html')

@admin_bp.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    session.pop('admin_email', None)
    session.pop('admin_name', None)
    flash('You have been securely logged out.', 'info')
    return redirect(url_for('admin.login'))

@admin_bp.route('/dashboard')
@admin_required
def dashboard():
    db = current_app.db
    total_movies = db.movies.count_documents({})
    published_movies = db.movies.count_documents({'status': 'published'})
    draft_movies = db.movies.count_documents({'status': 'draft'})
    featured_movies = db.movies.count_documents({'featured': True})

    pipeline = [{'$group': {'_id': None, 'total_views': {'$sum': '$views'}, 'total_downloads': {'$sum': '$downloads'}}}]
    aggregate_res = list(db.movies.aggregate(pipeline))
    total_views = aggregate_res[0]['total_views'] if aggregate_res else 0
    total_downloads = aggregate_res[0]['total_downloads'] if aggregate_res else 0

    top_movies = list(db.movies.find().sort('views', -1).limit(5))
    genres = list(db.genres.find())

    return render_template(
        'admin/dashboard.html',
        total_movies=total_movies,
        published_movies=published_movies,
        draft_movies=draft_movies,
        featured_movies=featured_movies,
        total_views=total_views,
        total_downloads=total_downloads,
        top_movies=top_movies,
        genres=genres
    )

@admin_bp.route('/movies')
@admin_required
def movies():
    db = current_app.db
    query_text = request.args.get('q', '').strip()
    status_filter = request.args.get('status', '').strip()
    genre_filter = request.args.get('genre', '').strip()

    mongo_filter = {}
    if status_filter:
        mongo_filter['status'] = status_filter
    if genre_filter:
        mongo_filter['genre'] = genre_filter
    if query_text:
        regex = re.compile(re.escape(query_text), re.IGNORECASE)
        mongo_filter['title'] = regex

    movies_list = list(db.movies.find(mongo_filter).sort('created_at', -1))
    genres = list(db.genres.find().sort('name', 1))

    return render_template(
        'admin/movies.html',
        movies=movies_list,
        genres=genres,
        query_text=query_text,
        status_filter=status_filter,
        genre_filter=genre_filter
    )

@admin_bp.route('/movies/add', methods=['GET', 'POST'])
@admin_required
def add_movie():
    db = current_app.db
    genres = list(db.genres.find().sort('name', 1))

    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        slug = request.form.get('slug', '').strip() or title.lower().replace(' ', '-')
        description = request.form.get('description', '').strip()
        video_url = request.form.get('video_url', '').strip()

        if not title or not description or not video_url:
            flash('Title, description, and video URL are required.', 'danger')
            return render_template('admin/add_movie.html', genres=genres, form=request.form)

        selected_genres = request.form.getlist('genre')
        selected_qualities = request.form.getlist('quality') or ['1080p']
        cast_raw = request.form.get('cast', '')
        cast_list = [c.strip() for c in cast_raw.split(',') if c.strip()]

        movie_data = {
            'title': title,
            'slug': slug,
            'description': description,
            'poster_url': request.form.get('poster_url', '').strip(),
            'banner_url': request.form.get('banner_url', '').strip(),
            'video_url': video_url,
            'download_url': request.form.get('download_url', '').strip() or video_url,
            'year': int(request.form.get('year', 2026)),
            'genre': selected_genres,
            'language': request.form.get('language', 'English').strip(),
            'country': request.form.get('country', 'USA').strip(),
            'runtime': request.form.get('runtime', '90 min').strip(),
            'quality': selected_qualities,
            'director': request.form.get('director', '').strip(),
            'cast': cast_list,
            'featured': bool(request.form.get('featured')),
            'status': request.form.get('status', 'published'),
            'license_type': request.form.get('license_type', 'Creative Commons Attribution / Public Domain').strip(),
            'file_size': request.form.get('file_size', '450 MB').strip()
        }

        doc = MovieModel.create_movie_dict(movie_data)
        db.movies.insert_one(doc)
        flash(f"Movie '{title}' successfully added to database.", 'success')
        return redirect(url_for('admin.movies'))

    return render_template('admin/add_movie.html', genres=genres)

@admin_bp.route('/movies/edit/<movie_id>', methods=['GET', 'POST'])
@admin_required
def edit_movie(movie_id):
    db = current_app.db
    movie = db.movies.find_one({'_id': ObjectId(movie_id)})
    if not movie:
        abort(404)

    genres = list(db.genres.find().sort('name', 1))

    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        slug = request.form.get('slug', '').strip()
        description = request.form.get('description', '').strip()
        video_url = request.form.get('video_url', '').strip()

        cast_raw = request.form.get('cast', '')
        cast_list = [c.strip() for c in cast_raw.split(',') if c.strip()]

        update_fields = {
            'title': title,
            'slug': slug,
            'description': description,
            'poster_url': request.form.get('poster_url', '').strip(),
            'banner_url': request.form.get('banner_url', '').strip(),
            'video_url': video_url,
            'download_url': request.form.get('download_url', '').strip() or video_url,
            'year': int(request.form.get('year', 2026)),
            'genre': request.form.getlist('genre'),
            'language': request.form.get('language', 'English').strip(),
            'country': request.form.get('country', 'USA').strip(),
            'runtime': request.form.get('runtime', '90 min').strip(),
            'quality': request.form.getlist('quality') or ['1080p'],
            'director': request.form.get('director', '').strip(),
            'cast': cast_list,
            'featured': bool(request.form.get('featured')),
            'status': request.form.get('status', 'published'),
            'license_type': request.form.get('license_type', '').strip(),
            'file_size': request.form.get('file_size', '450 MB').strip()
        }

        db.movies.update_one({'_id': ObjectId(movie_id)}, {'$set': update_fields})
        flash(f"Movie '{title}' updated successfully.", 'success')
        return redirect(url_for('admin.movies'))

    return render_template('admin/edit_movie.html', movie=movie, genres=genres)

@admin_bp.route('/movies/delete/<movie_id>', methods=['POST'])
@admin_required
def delete_movie(movie_id):
    db = current_app.db
    movie = db.movies.find_one({'_id': ObjectId(movie_id)})
    if movie:
        db.movies.delete_one({'_id': ObjectId(movie_id)})
        flash(f"Movie '{movie.get('title')}' was permanently removed.", 'info')
    return redirect(url_for('admin.movies'))

@admin_bp.route('/movies/toggle-status/<movie_id>', methods=['POST'])
@admin_required
def toggle_status(movie_id):
    db = current_app.db
    movie = db.movies.find_one({'_id': ObjectId(movie_id)})
    if movie:
        new_status = 'draft' if movie.get('status') == 'published' else 'published'
        db.movies.update_one({'_id': ObjectId(movie_id)}, {'$set': {'status': new_status}})
        flash(f"Status changed to {new_status}.", 'success')
    return redirect(url_for('admin.movies'))

@admin_bp.route('/genres', methods=['GET', 'POST'])
@admin_required
def genres():
    db = current_app.db

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        description = request.form.get('description', '').strip()
        if name:
            doc = GenreModel.create_genre_dict(name, description)
            db.genres.insert_one(doc)
            flash(f"Genre '{name}' added successfully.", 'success')
            return redirect(url_for('admin.genres'))

    genres_list = list(db.genres.find().sort('name', 1))
    return render_template('admin/genres.html', genres=genres_list)

@admin_bp.route('/genres/delete/<genre_id>', methods=['POST'])
@admin_required
def delete_genre(genre_id):
    db = current_app.db
    db.genres.delete_one({'_id': ObjectId(genre_id)})
    flash('Genre removed from catalog.', 'info')
    return redirect(url_for('admin.genres'))

@admin_bp.route('/settings', methods=['GET', 'POST'])
@admin_required
def settings():
    db = current_app.db
    current_settings = db.settings.find_one() or {}

    if request.method == 'POST':
        update_data = {
            'site_name': request.form.get('site_name', 'CineVault').strip(),
            'site_logo': request.form.get('site_logo', '').strip(),
            'site_description': request.form.get('site_description', '').strip(),
            'footer_text': request.form.get('footer_text', '').strip(),
            'contact_email': request.form.get('contact_email', '').strip(),
            'dmca_contact': request.form.get('dmca_contact', '').strip(),
            'google_analytics_id': request.form.get('google_analytics_id', '').strip(),
            'social_links': {
                'twitter': request.form.get('twitter', '').strip(),
                'github': request.form.get('github', '').strip(),
                'youtube': request.form.get('youtube', '').strip(),
            }
        }
        db.settings.update_one({}, {'$set': update_data}, upsert=True)
        flash('Site settings updated.', 'success')
        return redirect(url_for('admin.settings'))

    return render_template('admin/settings.html', settings=current_settings)

@admin_bp.route('/ads', methods=['GET', 'POST'])
@admin_required
def ads():
    db = current_app.db
    current_settings = db.settings.find_one() or {}
    current_ads = current_settings.get('ads', {})

    if request.method == 'POST':
        ads_data = {
            'homepage_ad_enabled': bool(request.form.get('homepage_ad_enabled')),
            'homepage_ad_code': request.form.get('homepage_ad_code', '').strip(),
            'movie_details_ad_enabled': bool(request.form.get('movie_details_ad_enabled')),
            'movie_details_ad_code': request.form.get('movie_details_ad_code', '').strip(),
            'watch_page_ad_enabled': bool(request.form.get('watch_page_ad_enabled')),
            'watch_page_ad_code': request.form.get('watch_page_ad_code', '').strip(),
            'download_page_ad_enabled': bool(request.form.get('download_page_ad_enabled')),
            'download_page_ad_code': request.form.get('download_page_ad_code', '').strip(),
        }
        db.settings.update_one({}, {'$set': {'ads': ads_data}}, upsert=True)
        flash('Ad management configurations updated.', 'success')
        return redirect(url_for('admin.ads'))

    return render_template('admin/ads.html', ads=current_ads)

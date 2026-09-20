from flask import Blueprint, render_template, current_app, Response
from datetime import datetime

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    db = current_app.db
    # Query featured movies
    featured_movies = list(db.movies.find({'status': 'published', 'featured': True}).limit(5))
    # Query latest published movies
    latest_movies = list(db.movies.find({'status': 'published'}).sort('created_at', -1).limit(12))
    # Query most viewed movies
    popular_movies = list(db.movies.find({'status': 'published'}).sort('views', -1).limit(12))
    # All genres
    genres = list(db.genres.find().sort('name', 1))
    settings = db.settings.find_one() or {}

    return render_template(
        'index.html',
        featured_movies=featured_movies,
        latest_movies=latest_movies,
        popular_movies=popular_movies,
        genres=genres,
        settings=settings
    )

@main_bp.route('/legal')
def legal():
    db = current_app.db
    settings = db.settings.find_one() or {}
    return render_template('legal.html', settings=settings)

@main_bp.route('/robots.txt')
def robots():
    content = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/

Sitemap: https://cinevault.onrender.com/sitemap.xml
"""
    return Response(content, mimetype='text/plain')

@main_bp.route('/sitemap.xml')
def sitemap():
    db = current_app.db
    movies = list(db.movies.find({'status': 'published'}))
    now = datetime.utcnow().strftime('%Y-%m-%d')

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        '    <loc>https://cinevault.onrender.com/</loc>',
        '    <changefreq>daily</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://cinevault.onrender.com/movies</loc>',
        '    <changefreq>daily</changefreq>',
        '    <priority>0.9</priority>',
        '  </url>',
        '  <url>',
        '    <loc>https://cinevault.onrender.com/legal</loc>',
        '    <changefreq>monthly</changefreq>',
        '    <priority>0.5</priority>',
        '  </url>'
    ]

    for m in movies:
        xml_lines.extend([
            '  <url>',
            f"    <loc>https://cinevault.onrender.com/movie/{m['slug']}</loc>",
            f"    <lastmod>{now}</lastmod>",
            '    <changefreq>weekly</changefreq>',
            '    <priority>0.8</priority>',
            '  </url>',
            '  <url>',
            f"    <loc>https://cinevault.onrender.com/watch/{m['slug']}</loc>",
            f"    <lastmod>{now}</lastmod>",
            '    <changefreq>weekly</changefreq>',
            '    <priority>0.8</priority>',
            '  </url>'
        ])

    xml_lines.append('</urlset>')
    return Response('\n'.join(xml_lines), mimetype='application/xml')

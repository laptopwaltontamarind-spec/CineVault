from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId
import json
import time

api_bp = Blueprint('api', __name__, url_prefix='/api')

def serialize_doc(doc):
    if not doc:
        return None
    doc['_id'] = str(doc['_id'])
    if 'created_at' in doc and hasattr(doc['created_at'], 'isoformat'):
        doc['created_at'] = doc['created_at'].isoformat()
    if 'updated_at' in doc and hasattr(doc['updated_at'], 'isoformat'):
        doc['updated_at'] = doc['updated_at'].isoformat()
    return doc

@api_bp.route('/movies', methods=['GET'])
def get_movies():
    db = current_app.db
    genre = request.args.get('genre')
    search = request.args.get('search')
    limit = int(request.args.get('limit', 20))

    query = {'status': 'published'}
    if genre:
        query['genre'] = genre
    if search:
        query['title'] = {'$regex': search, '$options': 'i'}

    movies = [serialize_doc(m) for m in db.movies.find(query).limit(limit)]
    return jsonify({'status': 'success', 'count': len(movies), 'data': movies})

@api_bp.route('/movies/<slug>', methods=['GET'])
def get_movie_detail(slug):
    db = current_app.db
    movie = db.movies.find_one({'slug': slug, 'status': 'published'})
    if not movie:
        return jsonify({'status': 'error', 'message': 'Movie not found'}), 404
    return jsonify({'status': 'success', 'data': serialize_doc(movie)})

@api_bp.route('/movies/<slug>/view', methods=['POST'])
def increment_view(slug):
    db = current_app.db
    res = db.movies.update_one({'slug': slug}, {'$inc': {'views': 1}})
    if res.matched_count == 0:
        return jsonify({'status': 'error', 'message': 'Movie not found'}), 404
    return jsonify({'status': 'success', 'message': 'View counted'})

@api_bp.route('/movies/<slug>/download', methods=['POST'])
def increment_download(slug):
    db = current_app.db
    res = db.movies.update_one({'slug': slug}, {'$inc': {'downloads': 1}})
    if res.matched_count == 0:
        return jsonify({'status': 'error', 'message': 'Movie not found'}), 404
    return jsonify({'status': 'success', 'message': 'Download counted'})

@api_bp.route('/genres', methods=['GET'])
def get_genres():
    db = current_app.db
    genres = [serialize_doc(g) for g in db.genres.find()]
    return jsonify({'status': 'success', 'data': genres})

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    db = current_app.db
    total_movies = db.movies.count_documents({'status': 'published'})
    pipeline = [{'$group': {'_id': None, 'views': {'$sum': '$views'}, 'downloads': {'$sum': '$downloads'}}}]
    res = list(db.movies.aggregate(pipeline))
    views = res[0]['views'] if res else 0
    downloads = res[0]['downloads'] if res else 0

    return jsonify({
        'status': 'success',
        'stats': {
            'total_movies': total_movies,
            'total_views': views,
            'total_downloads': downloads
        }
    })

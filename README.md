# CineVault — Legal Movie Streaming & Download Platform

CineVault is a modern, high-performance web platform for discovering, streaming, and downloading legally licensed motion pictures and public-domain cinematic classics.

## Key Architecture & Core Rules
- **No Public Accounts**: Visitors browse, stream, and download without registration, logins, or payment paywalls.
- **Admin-Only Authentication**: Session-based authentication with cryptographically hashed passwords reserved strictly for administrators.
- **100% Legal Distribution**: Every indexed title is backed by verified Creative Commons licensing (e.g. Blender Foundation open movies) or historical Public Domain rights.
- **Anti-Abuse Analytics**: Throttled view increments and download tracking prevents duplicate counts.
- **Production Ready**: Fully configured for instant deployment on [Render](https://render.com) backed by MongoDB Atlas.

---

## Technology Stack

### Backend
- **Python 3.11+**
- **Flask 3.0** with modular Blueprints (`main`, `movie`, `search`, `admin`, `api`)
- **PyMongo 4.6** for MongoDB persistence
- **Gunicorn 21.2** WSGI Production Server
- **Werkzeug Security** for PBKDF2:SHA256 password hashing

### Frontend
- Modern responsive interface with Tailwind CSS styling
- Custom HTML5 Video Player with buffer tracking, playback rate, quality selector, and full screen
- Zero external ad trackers or privacy-invasive telemetry

---

## Directory Structure
```
cinevault/
├── app.py                  # Flask Application Factory & Error Handlers
├── config.py               # Environment configuration loader
├── requirements.txt        # Python production dependencies
├── Procfile                # Render process definition: `web: gunicorn app:app`
├── .env.example            # Environment variables blueprint
├── seed.py                 # Initializer for admin, default genres, and legal movies
├── routes/
│   ├── main.py             # Home, legal policy, robots.txt, sitemap.xml
│   ├── movie.py            # Movie catalog, details, watch page, download redirect
│   ├── search.py           # Search endpoint across metadata
│   ├── admin.py            # Admin login, dashboard, CRUD, ads, settings
│   └── api.py              # REST API endpoints for external integrations
├── models/
│   ├── movie.py            # Movie document schema & validator
│   ├── genre.py            # Genre schema & slug generator
│   ├── admin.py            # Admin user schema & password verification
│   └── settings.py         # Global site configuration & ad toggles
├── static/                 # Static assets (CSS, JS, branding)
└── templates/              # Jinja2 HTML templates & error handlers
```

---

## Local Development Setup

### 1. Clone & Setup Virtual Environment
```bash
git clone <your-repo-url> cinevault
cd cinevault
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your values:
```env
SECRET_KEY=your-secure-random-key
MONGO_URI=mongodb://localhost:27017/cinevault
ADMIN_EMAIL=admin@cinevault.org
ADMIN_PASSWORD=admin123
```

### 4. Seed Database
Initialize with sample movies, genres, and the default admin user:
```bash
python seed.py
```

### 5. Run the Server
```bash
python app.py
```
Visit `http://localhost:5000` in your web browser.

---

## Render Deployment Guide

1. **Push code to GitHub or GitLab repository**.
2. **Log into Render Dashboard** and click **New + > Web Service**.
3. **Connect your repository**.
4. Configure service parameters:
   - **Name**: `cinevault-movies`
   - **Region**: Choose the closest region (e.g., Oregon, Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. **Add Environment Variables in Render**:
   - `SECRET_KEY`: A 64-character random string
   - `MONGO_URI`: Your MongoDB Atlas connection string (`mongodb+srv://<user>:<password>@cluster0.mongodb.net/cinevault?retryWrites=true&w=majority`)
   - `FLASK_ENV`: `production`
   - `ADMIN_EMAIL`: `admin@yourdomain.com`
   - `ADMIN_PASSWORD`: Your chosen strong master password
6. Click **Create Web Service**. Render will automatically build the container and deploy the app with automatic SSL certificate generation.
7. Once online, open the Render SSH shell (or run locally targeting the Atlas URI) to execute `python seed.py` once to seed the platform.

---

## Admin Panel Access
- Access URL: `https://<your-render-url>/admin/login`
- Default seeded email: `admin@cinevault.org`
- Default seeded password: `admin123`

---

## Intellectual Property Compliance & DMCA
All films included in the database are:
1. Licensed under **Creative Commons Attribution (CC-BY)** by original creators (such as the Blender Foundation).
2. Certified in the **Public Domain** due to expiration of term (works created prior to 1929) or release without notice.
All DMCA requests can be directed to the designated compliance email configured via `/admin/settings`.

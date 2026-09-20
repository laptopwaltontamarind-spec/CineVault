from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class AdminModel:
    @staticmethod
    def create_admin_dict(email, password, name='Platform Administrator'):
        return {
            'email': email.strip().lower(),
            'name': name.strip(),
            'password_hash': generate_password_hash(password),
            'role': 'admin',
            'created_at': datetime.utcnow()
        }

    @staticmethod
    def verify_password(password_hash, password):
        return check_password_hash(password_hash, password)

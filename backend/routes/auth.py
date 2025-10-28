from flask import Blueprint, request, jsonify
from models import db, Donor, Admin
import jwt
from datetime import datetime, timedelta
from config import Config

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        required_fields = ['fullName', 'age', 'gender', 'bloodGroup', 'contact', 'email', 'city', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        if Donor.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400

        new_donor = Donor(
            full_name=data['fullName'],
            age=data['age'],
            gender=data['gender'],
            blood_group=data['bloodGroup'],
            contact=data['contact'],
            email=data['email'],
            city=data['city'],
            status='pending'
        )
        new_donor.set_password(data['password'])

        db.session.add(new_donor)
        db.session.commit()

        return jsonify({
            'message': 'Registration successful',
            'donor': new_donor.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400

        role = data.get('role', 'user')

        if role == 'admin':
            user = Admin.query.filter_by(email=data['email']).first()
            user_type = 'admin'
        else:
            user = Donor.query.filter_by(email=data['email']).first()
            user_type = 'donor'

        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401

        if user_type == 'donor' and user.status != 'approved':
            return jsonify({'error': 'Your account is pending approval'}), 403

        token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'type': user_type,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, Config.JWT_SECRET_KEY, algorithm='HS256')

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict(),
            'type': user_type
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401

        if token.startswith('Bearer '):
            token = token[7:]

        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])

        return jsonify({
            'valid': True,
            'user_id': payload['user_id'],
            'type': payload['type']
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

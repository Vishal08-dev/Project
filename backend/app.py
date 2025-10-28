from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes.auth import auth_bp
from routes.donors import donors_bp
from routes.blood_requests import blood_request_bp
from routes.admin import admin_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={
        r"/api/*": {
            "origins": Config.CORS_ORIGINS,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    db.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(donors_bp)
    app.register_blueprint(blood_request_bp)
    app.register_blueprint(admin_bp)

    @app.route('/')
    def index():
        return jsonify({
            'message': 'BloodLink API Server',
            'version': '1.0.0',
            'status': 'running'
        })

    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'database': 'connected'
        })

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app

if __name__ == '__main__':
    app = create_app()

    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully!")
        except Exception as e:
            print(f"Error creating database tables: {e}")

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )

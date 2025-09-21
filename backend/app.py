from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config.config import config
from models.models import db
from routes.auth import auth_bp
from routes.products import products_bp
from routes.payments import payments_bp
import os

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=[app.config.get('FRONTEND_URL', 'http://localhost:3000')])
    JWTManager(app)
    Migrate(app, db)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(payments_bp)
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'app': 'Baddie Reseller API',
            'version': '1.0.0'
        }), 200
    
    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
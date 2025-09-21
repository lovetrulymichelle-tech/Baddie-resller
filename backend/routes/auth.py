from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import User, MagicLink, db
# from utils.stripe_service import StripeService
# from email_validator import validate_email, EmailNotValidError
import secrets
import re
from datetime import datetime, timedelta
# import stripe

auth_bp = Blueprint('auth', __name__)
# stripe_service = StripeService()

def is_valid_email(email):
    """Simple email validation"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    
    email = data['email'].lower().strip()
    password = data.get('password')
    
    # Validate email
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email address'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 409
    
    try:
        # Create user
        user = User(email=email)
        if password:
            user.set_password(password)
        
        db.session.add(user)
        db.session.flush()  # Get user ID before commit
        
        # Create Stripe customer - commented out for now
        # customer = stripe_service.create_customer(email, user.id)
        # user.stripe_customer_id = customer.id
        user.stripe_customer_id = f"cus_demo_{user.id}"  # Demo customer ID
        
        db.session.commit()
        
        # Create access token
        from flask_jwt_extended import create_access_token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """Login with email and password"""
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    email = data['email'].lower().strip()
    password = data['password']
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is disabled'}), 401
    
    from flask_jwt_extended import create_access_token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/api/auth/magic-link', methods=['POST'])
def send_magic_link():
    """Send magic link for passwordless login"""
    data = request.get_json()
    
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    
    email = data['email'].lower().strip()
    
    # Validate email - skip for demo
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email address'}), 400
    
    # Create or get user
    user = User.query.filter_by(email=email).first()
    if not user:
        # Create new user without password
        user = User(email=email)
        db.session.add(user)
        db.session.flush()
        
        # Create demo Stripe customer
        user.stripe_customer_id = f"cus_demo_{user.id}"
    
    # Generate magic link token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=15)  # 15-minute expiry
    
    # Clean up old tokens for this email
    MagicLink.query.filter_by(email=email).delete()
    
    # Create new magic link
    magic_link = MagicLink(
        email=email,
        token=token,
        expires_at=expires_at
    )
    
    db.session.add(magic_link)
    db.session.commit()
    
    # In a real app, you would send this via email
    magic_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/auth/magic?token={token}"
    
    # For demo purposes, return the link (remove in production)
    return jsonify({
        'success': True,
        'message': 'Magic link sent to your email',
        'magic_link': magic_url  # Remove in production
    }), 200

@auth_bp.route('/api/auth/magic-login', methods=['POST'])
def magic_login():
    """Login using magic link token"""
    data = request.get_json()
    
    if not data or 'token' not in data:
        return jsonify({'error': 'Token is required'}), 400
    
    token = data['token']
    
    # Find and validate magic link
    magic_link = MagicLink.query.filter_by(token=token, used=False).first()
    
    if not magic_link:
        return jsonify({'error': 'Invalid or expired token'}), 401
    
    if magic_link.expires_at < datetime.utcnow():
        return jsonify({'error': 'Token has expired'}), 401
    
    # Mark token as used
    magic_link.used = True
    
    # Get or create user
    user = User.query.filter_by(email=magic_link.email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    db.session.commit()
    
    # Create access token
    from flask_jwt_extended import create_access_token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200

@auth_bp.route('/api/auth/refresh', methods=['POST'])
@jwt_required()
def refresh_token():
    """Refresh access token"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 404
    
    from flask_jwt_extended import create_access_token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'success': True,
        'access_token': access_token
    }), 200
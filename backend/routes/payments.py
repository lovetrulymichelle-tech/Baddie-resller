from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import User, db
# from utils.stripe_service import StripeService
# import stripe

payments_bp = Blueprint('payments', __name__)
# stripe_service = StripeService()

@payments_bp.route('/api/payments/create-trial-session', methods=['POST'])
@jwt_required()
def create_trial_session():
    """Create Stripe checkout session for $1 trial"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.trial_used:
        return jsonify({'error': 'Trial already used'}), 400
    
    if user.is_subscribed():
        return jsonify({'error': 'User already has active subscription'}), 400
    
    # For demo purposes, simulate subscription activation
    user.subscription_status = 'trial'
    user.trial_used = True
    db.session.commit()
    
    return jsonify({
        'success': True,
        'checkout_url': f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/dashboard?trial=true",
        'session_id': f"demo_session_{user.id}"
    }), 200

@payments_bp.route('/api/payments/create-subscription-session', methods=['POST'])
@jwt_required()
def create_subscription_session():
    """Create Stripe checkout session for full subscription"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.is_subscribed():
        return jsonify({'error': 'User already has active subscription'}), 400
    
    # For demo purposes, simulate subscription activation
    user.subscription_status = 'active'
    db.session.commit()
    
    return jsonify({
        'success': True,
        'checkout_url': f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/dashboard?subscription=true",
        'session_id': f"demo_session_full_{user.id}"
    }), 200

@payments_bp.route('/api/payments/verify-session', methods=['POST'])
@jwt_required()
def verify_session():
    """Verify Stripe checkout session and update user status"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    session_id = data.get('session_id')
    
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    # For demo purposes, always return success
    return jsonify({
        'success': True,
        'payment_status': 'paid',
        'user': user.to_dict()
    }), 200

@payments_bp.route('/api/payments/subscription-status', methods=['GET'])
@jwt_required()
def get_subscription_status():
    """Get user's subscription status"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    subscription_info = {
        'status': user.subscription_status,
        'is_subscribed': user.is_subscribed(),
        'trial_used': user.trial_used,
        'stripe_customer_id': user.stripe_customer_id,
        'subscription_id': user.subscription_id
    }
    
    return jsonify(subscription_info), 200

@payments_bp.route('/api/payments/cancel-subscription', methods=['POST'])
@jwt_required()
def cancel_subscription():
    """Cancel user's subscription"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if not user.is_subscribed():
        return jsonify({'error': 'No active subscription found'}), 400
    
    # For demo purposes, cancel immediately
    user.subscription_status = 'canceled'
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Subscription has been canceled'
    }), 200

@payments_bp.route('/api/payments/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    # For demo purposes, always return success
    return jsonify({'success': True}), 200
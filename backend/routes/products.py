from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import User, Product, db
# from utils.ai_generator import AIProductGenerator
import json

products_bp = Blueprint('products', __name__)
# ai_generator = AIProductGenerator()

@products_bp.route('/api/products/generate', methods=['POST'])
@jwt_required()
def generate_product():
    """Generate a new product using AI"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or not user.is_subscribed():
        return jsonify({'error': 'Active subscription required'}), 403
    
    data = request.get_json()
    if not data or 'category' not in data:
        return jsonify({'error': 'Category is required'}), 400
    
    category = data.get('category')
    
    # For demo purposes, generate a sample product instead of using AI
    sample_products = {
        'Fashion': {
            'title': 'Baddie Essential Crop Top Collection',
            'description': 'Elevate your style with this must-have crop top collection. Perfect for the modern baddie lifestyle, featuring premium materials and attention-grabbing designs. These versatile pieces can be styled for any occasion.',
            'suggested_price': 24.99,
            'keywords': ['fashion', 'crop top', 'baddie', 'style', 'trendy']
        },
        'Accessories': {
            'title': 'Statement Gold Chain Necklace Set',
            'description': 'Complete your baddie look with this stunning gold chain necklace set. High-quality materials meet contemporary design in this collection that\'s perfect for layering and making a statement.',
            'suggested_price': 19.99,
            'keywords': ['jewelry', 'necklace', 'gold', 'statement', 'accessories']
        }
    }
    
    product_data = sample_products.get(category, sample_products['Fashion'])
    
    try:
        # Create product in database
        product = Product(
            user_id=current_user_id,
            title=product_data['title'],
            description=product_data['description'],
            category=category,
            price=product_data['suggested_price'],
            keywords=json.dumps(product_data['keywords']),
            prompt_used=f"Category: {category}",
            ai_model="demo-ai"
        )
        
        db.session.add(product)
        db.session.commit()
        
        response_data = product.to_dict()
        response_data['keywords'] = product_data['keywords']  # Return as array
        
        return jsonify({
            'success': True,
            'product': response_data
        }), 201
        
    except Exception as e:
        current_app.logger.error(f"Product generation error: {str(e)}")
        return jsonify({'error': 'Failed to generate product'}), 500

@products_bp.route('/api/products', methods=['GET'])
@jwt_required()
def get_products():
    """Get user's products with pagination"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    category = request.args.get('category')
    
    query = Product.query.filter_by(user_id=current_user_id)
    
    if category:
        query = query.filter_by(category=category)
    
    products = query.order_by(Product.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'products': [product.to_dict() for product in products.items],
        'total': products.total,
        'pages': products.pages,
        'current_page': page,
        'per_page': per_page
    }), 200

@products_bp.route('/api/products/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    """Get a specific product"""
    current_user_id = get_jwt_identity()
    product = Product.query.filter_by(id=product_id, user_id=current_user_id).first()
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    product_data = product.to_dict()
    if product.keywords:
        try:
            product_data['keywords'] = json.loads(product.keywords)
        except json.JSONDecodeError:
            product_data['keywords'] = []
    
    return jsonify({'product': product_data}), 200

@products_bp.route('/api/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update a product"""
    current_user_id = get_jwt_identity()
    product = Product.query.filter_by(id=product_id, user_id=current_user_id).first()
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Update allowed fields
    if 'title' in data:
        product.title = data['title']
    if 'description' in data:
        product.description = data['description']
    if 'category' in data:
        product.category = data['category']
    if 'price' in data:
        product.price = float(data['price'])
    if 'keywords' in data:
        product.keywords = json.dumps(data['keywords']) if isinstance(data['keywords'], list) else data['keywords']
    
    try:
        db.session.commit()
        return jsonify({'success': True, 'product': product.to_dict()}), 200
    except Exception as e:
        current_app.logger.error(f"Product update error: {str(e)}")
        return jsonify({'error': 'Failed to update product'}), 500

@products_bp.route('/api/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product"""
    current_user_id = get_jwt_identity()
    product = Product.query.filter_by(id=product_id, user_id=current_user_id).first()
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        current_app.logger.error(f"Product deletion error: {str(e)}")
        return jsonify({'error': 'Failed to delete product'}), 500

@products_bp.route('/api/products/stats', methods=['GET'])
@jwt_required()
def get_product_stats():
    """Get user's product statistics"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    total_products = Product.query.filter_by(user_id=current_user_id).count()
    
    # Get category breakdown
    categories = db.session.query(
        Product.category, 
        db.func.count(Product.id).label('count')
    ).filter_by(user_id=current_user_id).group_by(Product.category).all()
    
    category_stats = {category: count for category, count in categories}
    
    # Calculate average price
    avg_price = db.session.query(db.func.avg(Product.price)).filter_by(user_id=current_user_id).scalar() or 0
    
    return jsonify({
        'total_products': total_products,
        'categories': category_stats,
        'average_price': round(float(avg_price), 2),
        'subscription_status': user.subscription_status
    }), 200
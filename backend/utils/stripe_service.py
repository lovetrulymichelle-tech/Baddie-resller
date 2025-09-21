import stripe
from flask import current_app
from models.models import User, db

class StripeService:
    def __init__(self):
        self.stripe = stripe
    
    def initialize_stripe(self):
        """Initialize Stripe with secret key"""
        secret_key = current_app.config.get('STRIPE_SECRET_KEY')
        if not secret_key:
            raise ValueError("Stripe secret key not configured")
        self.stripe.api_key = secret_key
    
    def create_customer(self, email, user_id):
        """Create a Stripe customer"""
        if not self.stripe.api_key:
            self.initialize_stripe()
            
        try:
            customer = self.stripe.Customer.create(
                email=email,
                metadata={'user_id': str(user_id)}
            )
            return customer
        except stripe.error.StripeError as e:
            current_app.logger.error(f"Stripe customer creation error: {str(e)}")
            raise
    
    def create_trial_checkout_session(self, customer_id, user_email):
        """Create a Stripe checkout session for $1 trial"""
        if not self.stripe.api_key:
            self.initialize_stripe()
            
        try:
            trial_price_id = current_app.config.get('TRIAL_PRICE_ID')
            subscription_price_id = current_app.config.get('SUBSCRIPTION_PRICE_ID')
            
            if not trial_price_id or not subscription_price_id:
                raise ValueError("Stripe price IDs not configured")
            
            session = self.stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=['card'],
                mode='subscription',
                line_items=[{
                    'price': trial_price_id,
                    'quantity': 1,
                }],
                success_url=f"{current_app.config.get('FRONTEND_URL')}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{current_app.config.get('FRONTEND_URL')}/pricing",
                metadata={
                    'trial': 'true',
                    'next_price_id': subscription_price_id
                },
                subscription_data={
                    'trial_period_days': 7,  # 7-day trial after $1 payment
                    'metadata': {
                        'trial_user': 'true'
                    }
                }
            )
            return session
        except stripe.error.StripeError as e:
            current_app.logger.error(f"Stripe checkout session error: {str(e)}")
            raise
    
    def create_subscription_checkout_session(self, customer_id, user_email):
        """Create a Stripe checkout session for full subscription"""
        if not self.stripe.api_key:
            self.initialize_stripe()
            
        try:
            subscription_price_id = current_app.config.get('SUBSCRIPTION_PRICE_ID')
            
            if not subscription_price_id:
                raise ValueError("Subscription price ID not configured")
            
            session = self.stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=['card'],
                mode='subscription',
                line_items=[{
                    'price': subscription_price_id,
                    'quantity': 1,
                }],
                success_url=f"{current_app.config.get('FRONTEND_URL')}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{current_app.config.get('FRONTEND_URL')}/pricing",
            )
            return session
        except stripe.error.StripeError as e:
            current_app.logger.error(f"Stripe checkout session error: {str(e)}")
            raise
    
    def retrieve_session(self, session_id):
        """Retrieve a Stripe checkout session"""
        if not self.stripe.api_key:
            self.initialize_stripe()
            
        try:
            return self.stripe.checkout.Session.retrieve(session_id)
        except stripe.error.StripeError as e:
            current_app.logger.error(f"Stripe session retrieval error: {str(e)}")
            raise
    
    def handle_webhook_event(self, event):
        """Handle Stripe webhook events"""
        if not self.stripe.api_key:
            self.initialize_stripe()
            
        event_type = event['type']
        
        if event_type == 'customer.subscription.created':
            self._handle_subscription_created(event)
        elif event_type == 'customer.subscription.updated':
            self._handle_subscription_updated(event)
        elif event_type == 'customer.subscription.deleted':
            self._handle_subscription_deleted(event)
        elif event_type == 'invoice.payment_succeeded':
            self._handle_payment_succeeded(event)
        elif event_type == 'invoice.payment_failed':
            self._handle_payment_failed(event)
    
    def _handle_subscription_created(self, event):
        """Handle subscription creation"""
        subscription = event['data']['object']
        customer_id = subscription['customer']
        
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if user:
            user.subscription_id = subscription['id']
            user.subscription_status = 'trial' if subscription.get('trial_start') else 'active'
            if subscription.get('trial_start'):
                user.trial_used = True
            db.session.commit()
    
    def _handle_subscription_updated(self, event):
        """Handle subscription updates"""
        subscription = event['data']['object']
        customer_id = subscription['customer']
        
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if user:
            status = subscription['status']
            if status == 'active':
                user.subscription_status = 'active'
            elif status == 'trialing':
                user.subscription_status = 'trial'
            elif status in ['canceled', 'incomplete_expired']:
                user.subscription_status = 'canceled'
            else:
                user.subscription_status = 'inactive'
            
            db.session.commit()
    
    def _handle_subscription_deleted(self, event):
        """Handle subscription cancellation"""
        subscription = event['data']['object']
        customer_id = subscription['customer']
        
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if user:
            user.subscription_status = 'canceled'
            user.subscription_id = None
            db.session.commit()
    
    def _handle_payment_succeeded(self, event):
        """Handle successful payment"""
        invoice = event['data']['object']
        customer_id = invoice['customer']
        
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if user and user.subscription_status == 'trial':
            # If this is the first payment after trial, mark as active
            user.subscription_status = 'active'
            db.session.commit()
    
    def _handle_payment_failed(self, event):
        """Handle failed payment"""
        invoice = event['data']['object']
        customer_id = invoice['customer']
        
        user = User.query.filter_by(stripe_customer_id=customer_id).first()
        if user:
            # Mark subscription as inactive due to payment failure
            user.subscription_status = 'inactive'
            db.session.commit()
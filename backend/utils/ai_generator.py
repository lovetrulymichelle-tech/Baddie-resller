import openai
import json
from flask import current_app

class AIProductGenerator:
    def __init__(self):
        self.client = None
        
    def initialize_openai(self):
        """Initialize OpenAI client with API key"""
        api_key = current_app.config.get('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OpenAI API key not configured")
        self.client = openai.OpenAI(api_key=api_key)
    
    def generate_product(self, category, target_audience="resellers", style_preferences=None):
        """Generate a product using OpenAI GPT-4-mini"""
        if not self.client:
            self.initialize_openai()
            
        prompt = self._build_prompt(category, target_audience, style_preferences)
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an AI assistant specialized in creating compelling product listings for resellers. Generate detailed, SEO-optimized product descriptions that convert browsers into buyers."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            return self._parse_product_response(content)
            
        except Exception as e:
            current_app.logger.error(f"OpenAI API error: {str(e)}")
            return self._get_fallback_product(category)
    
    def _build_prompt(self, category, target_audience, style_preferences):
        """Build the prompt for product generation"""
        base_prompt = f"""
Generate a compelling product listing for the {category} category targeting {target_audience}.

Requirements:
- Create an attention-grabbing title (max 100 characters)
- Write a detailed description (200-400 words) that highlights benefits and features
- Suggest a competitive price range
- Include 5-8 relevant keywords for SEO
- Focus on what makes this product appealing to resellers

The product should be:
- Trendy and in-demand
- Suitable for online reselling
- Appealing to the "baddie" aesthetic and lifestyle
- High-margin potential

Format the response as JSON with these fields:
{{
    "title": "Product Title",
    "description": "Detailed product description...",
    "category": "{category}",
    "suggested_price": 29.99,
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}}
"""
        
        if style_preferences:
            base_prompt += f"\nStyle preferences: {style_preferences}"
            
        return base_prompt
    
    def _parse_product_response(self, content):
        """Parse the AI response into a structured product"""
        try:
            # Try to extract JSON from the response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = content[start_idx:end_idx]
                product_data = json.loads(json_str)
                
                # Validate required fields
                required_fields = ['title', 'description', 'category', 'suggested_price', 'keywords']
                for field in required_fields:
                    if field not in product_data:
                        raise ValueError(f"Missing required field: {field}")
                
                return product_data
            else:
                raise ValueError("No JSON found in response")
                
        except (json.JSONDecodeError, ValueError) as e:
            current_app.logger.warning(f"Failed to parse AI response: {str(e)}")
            # Return a structured version of the raw content
            return self._fallback_parse(content)
    
    def _fallback_parse(self, content):
        """Fallback parsing if JSON extraction fails"""
        lines = content.strip().split('\n')
        return {
            "title": "AI-Generated Product",
            "description": content[:400] if len(content) > 400 else content,
            "category": "Fashion",
            "suggested_price": 24.99,
            "keywords": ["trendy", "fashion", "style", "baddie", "aesthetic"]
        }
    
    def _get_fallback_product(self, category):
        """Return a fallback product if AI generation fails"""
        fallback_products = {
            "fashion": {
                "title": "Trendy Baddie Essential Collection",
                "description": "Elevate your style with this must-have collection perfect for the modern baddie lifestyle. Features premium materials, attention-grabbing design, and versatile styling options. Ideal for resellers looking to offer high-demand fashion pieces that customers love.",
                "category": category,
                "suggested_price": 29.99,
                "keywords": ["fashion", "trendy", "baddie", "style", "collection", "premium"]
            },
            "accessories": {
                "title": "Statement Baddie Accessories Set",
                "description": "Complete your baddie look with these eye-catching accessories. High-quality materials meet contemporary design in this collection that's perfect for resellers. Each piece is designed to complement the modern woman's lifestyle and aesthetic preferences.",
                "category": category,
                "suggested_price": 19.99,
                "keywords": ["accessories", "statement", "baddie", "jewelry", "trendy", "modern"]
            }
        }
        
        return fallback_products.get(category.lower(), fallback_products["fashion"])
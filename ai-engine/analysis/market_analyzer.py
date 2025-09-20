"""
Market Analyzer Module
Analyzes market trends, competition, and opportunities
"""

import numpy as np
from typing import Dict, List, Optional
from datetime import datetime, timedelta

class MarketAnalyzer:
    """AI-powered market analysis system"""
    
    def __init__(self):
        self.analysis_types = [
            "trend_analysis",
            "competitor_analysis",
            "demand_forecast",
            "opportunity_detection"
        ]
    
    async def analyze(self, data: dict) -> Dict:
        """
        Perform comprehensive market analysis
        
        Args:
            data: Dictionary containing market and product data
            
        Returns:
            Market analysis results
        """
        try:
            analysis_type = data.get("analysis_type", "comprehensive")
            products = data.get("products", [])
            market_data = data.get("market_data", {})
            timeframe = data.get("timeframe", "30d")
            
            if analysis_type == "comprehensive":
                return await self._comprehensive_analysis(products, market_data, timeframe)
            elif analysis_type == "trend_analysis":
                return await self._trend_analysis(products, market_data, timeframe)
            elif analysis_type == "competitor_analysis":
                return await self._competitor_analysis(products, market_data)
            else:
                return await self._demand_forecast(products, market_data, timeframe)
        
        except Exception as e:
            raise Exception(f"Market analysis failed: {str(e)}")
    
    async def _comprehensive_analysis(
        self, 
        products: List[dict], 
        market_data: dict, 
        timeframe: str
    ) -> Dict:
        """Perform comprehensive market analysis"""
        
        # Analyze trends
        trends = await self._trend_analysis(products, market_data, timeframe)
        
        # Analyze competition
        competition = await self._competitor_analysis(products, market_data)
        
        # Forecast demand
        demand = await self._demand_forecast(products, market_data, timeframe)
        
        # Detect opportunities
        opportunities = self._detect_opportunities(products, market_data)
        
        return {
            "analysis_type": "comprehensive",
            "timeframe": timeframe,
            "analysis_date": datetime.now().isoformat(),
            "summary": self._generate_market_summary(trends, competition, demand),
            "trends": trends,
            "competition": competition,
            "demand_forecast": demand,
            "opportunities": opportunities,
            "recommendations": self._generate_recommendations(trends, competition, demand, opportunities)
        }
    
    async def _trend_analysis(
        self, 
        products: List[dict], 
        market_data: dict, 
        timeframe: str
    ) -> Dict:
        """Analyze market trends"""
        
        # Placeholder trend analysis - replace with actual ML/statistical analysis
        trend_data = []
        
        for product in products:
            # Simulate trend calculation
            sales_history = product.get("sales_history", [])
            if len(sales_history) >= 2:
                recent_sales = np.mean(sales_history[-7:]) if len(sales_history) >= 7 else sales_history[-1]
                older_sales = np.mean(sales_history[:-7]) if len(sales_history) >= 14 else sales_history[0]
                
                trend_direction = "increasing" if recent_sales > older_sales else "decreasing"
                trend_strength = abs((recent_sales - older_sales) / older_sales) if older_sales > 0 else 0
            else:
                trend_direction = "stable"
                trend_strength = 0
            
            trend_data.append({
                "product_id": product.get("id"),
                "product_name": product.get("name"),
                "trend_direction": trend_direction,
                "trend_strength": round(trend_strength, 3),
                "growth_rate": round(trend_strength * 100, 2) if trend_direction == "increasing" else round(-trend_strength * 100, 2)
            })
        
        return {
            "overall_market_trend": self._calculate_overall_trend(trend_data),
            "product_trends": trend_data,
            "trending_categories": self._identify_trending_categories(products, trend_data)
        }
    
    async def _competitor_analysis(self, products: List[dict], market_data: dict) -> Dict:
        """Analyze competitor landscape"""
        
        competitor_data = []
        
        for product in products:
            product_id = product.get("id")
            current_price = product.get("current_price", 0)
            
            # Simulate competitor data - in real implementation, this would come from web scraping or APIs
            competitor_prices = market_data.get(f"competitors_{product_id}", [current_price * 0.9, current_price * 1.1])
            
            avg_competitor_price = np.mean(competitor_prices)
            min_competitor_price = min(competitor_prices)
            max_competitor_price = max(competitor_prices)
            
            price_position = "competitive"
            if current_price < min_competitor_price:
                price_position = "below_market"
            elif current_price > max_competitor_price:
                price_position = "above_market"
            
            competitor_data.append({
                "product_id": product_id,
                "product_name": product.get("name"),
                "our_price": current_price,
                "avg_competitor_price": round(avg_competitor_price, 2),
                "min_competitor_price": round(min_competitor_price, 2),
                "max_competitor_price": round(max_competitor_price, 2),
                "price_position": price_position,
                "competitive_advantage": round(((avg_competitor_price - current_price) / avg_competitor_price) * 100, 2)
            })
        
        return {
            "competitor_analysis": competitor_data,
            "market_position": self._assess_market_position(competitor_data),
            "competitive_threats": self._identify_threats(competitor_data),
            "competitive_opportunities": self._identify_competitive_opportunities(competitor_data)
        }
    
    async def _demand_forecast(self, products: List[dict], market_data: dict, timeframe: str) -> Dict:
        """Forecast product demand"""
        
        forecasts = []
        
        for product in products:
            sales_history = product.get("sales_history", [])
            
            if len(sales_history) >= 7:
                # Simple moving average forecast - replace with sophisticated forecasting
                recent_avg = np.mean(sales_history[-7:])
                seasonal_factor = self._calculate_seasonal_factor(datetime.now())
                
                forecast = recent_avg * seasonal_factor
                confidence = 0.75 if len(sales_history) >= 30 else 0.6
            else:
                forecast = product.get("daily_sales_avg", 1)
                confidence = 0.5
            
            forecasts.append({
                "product_id": product.get("id"),
                "product_name": product.get("name"),
                "current_daily_sales": product.get("daily_sales_avg", 1),
                "forecasted_daily_sales": round(forecast, 2),
                "forecast_change_percent": round(((forecast - product.get("daily_sales_avg", 1)) / product.get("daily_sales_avg", 1)) * 100, 2) if product.get("daily_sales_avg", 1) > 0 else 0,
                "confidence_score": confidence,
                "factors": ["seasonal_trends", "historical_performance"]
            })
        
        return {
            "forecast_period": timeframe,
            "forecasts": forecasts,
            "overall_demand_trend": self._calculate_overall_demand_trend(forecasts)
        }
    
    def _detect_opportunities(self, products: List[dict], market_data: dict) -> List[Dict]:
        """Detect market opportunities"""
        
        opportunities = []
        
        # High margin opportunity
        for product in products:
            current_price = product.get("current_price", 0)
            cost = product.get("cost", current_price * 0.6)
            margin = ((current_price - cost) / current_price) * 100 if current_price > 0 else 0
            
            if margin > 50:
                opportunities.append({
                    "type": "high_margin_product",
                    "product_id": product.get("id"),
                    "description": f"High margin product ({margin:.1f}%) - focus on marketing",
                    "potential_impact": "high",
                    "action_required": "increase_marketing_spend"
                })
        
        # Low competition opportunity
        # Placeholder logic - in real implementation, analyze actual competition data
        opportunities.append({
            "type": "market_gap",
            "description": "Potential gap in electronics category",
            "potential_impact": "medium",
            "action_required": "research_electronics_products"
        })
        
        return opportunities
    
    def _calculate_seasonal_factor(self, date: datetime) -> float:
        """Calculate seasonal adjustment factor"""
        # Simple seasonal factor based on month - replace with actual seasonal analysis
        month = date.month
        if month in [11, 12]:  # Holiday season
            return 1.3
        elif month in [1, 2]:  # Post-holiday
            return 0.8
        else:
            return 1.0
    
    def _calculate_overall_trend(self, trend_data: List[dict]) -> str:
        """Calculate overall market trend"""
        increasing_count = sum(1 for t in trend_data if t["trend_direction"] == "increasing")
        total_count = len(trend_data)
        
        if increasing_count > total_count * 0.6:
            return "positive"
        elif increasing_count < total_count * 0.4:
            return "negative"
        else:
            return "stable"
    
    def _identify_trending_categories(self, products: List[dict], trend_data: List[dict]) -> List[str]:
        """Identify trending product categories"""
        # Placeholder implementation
        return ["electronics", "clothing", "home_goods"]
    
    def _assess_market_position(self, competitor_data: List[dict]) -> str:
        """Assess overall market position"""
        competitive_count = sum(1 for c in competitor_data if c["price_position"] == "competitive")
        total_count = len(competitor_data)
        
        if competitive_count > total_count * 0.7:
            return "strong_competitive_position"
        else:
            return "needs_improvement"
    
    def _identify_threats(self, competitor_data: List[dict]) -> List[str]:
        """Identify competitive threats"""
        threats = []
        for item in competitor_data:
            if item["competitive_advantage"] < -10:
                threats.append(f"Significantly overpriced: {item['product_name']}")
        return threats
    
    def _identify_competitive_opportunities(self, competitor_data: List[dict]) -> List[str]:
        """Identify competitive opportunities"""
        opportunities = []
        for item in competitor_data:
            if item["competitive_advantage"] > 10:
                opportunities.append(f"Price advantage opportunity: {item['product_name']}")
        return opportunities
    
    def _calculate_overall_demand_trend(self, forecasts: List[dict]) -> Dict:
        """Calculate overall demand trend"""
        total_change = sum(f["forecast_change_percent"] for f in forecasts)
        avg_change = total_change / len(forecasts) if forecasts else 0
        
        return {
            "trend_direction": "increasing" if avg_change > 2 else "decreasing" if avg_change < -2 else "stable",
            "average_change_percent": round(avg_change, 2),
            "confidence": "high" if len(forecasts) > 10 else "medium"
        }
    
    def _generate_market_summary(self, trends: dict, competition: dict, demand: dict) -> str:
        """Generate executive summary of market analysis"""
        trend_direction = trends.get("overall_market_trend", "stable")
        market_position = competition.get("market_position", "unknown")
        demand_trend = demand.get("overall_demand_trend", {}).get("trend_direction", "stable")
        
        return f"Market showing {trend_direction} trends with {market_position}. Demand is {demand_trend}."
    
    def _generate_recommendations(self, trends: dict, competition: dict, demand: dict, opportunities: List[dict]) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if trends.get("overall_market_trend") == "positive":
            recommendations.append("Consider increasing inventory for trending products")
        
        if competition.get("market_position") == "needs_improvement":
            recommendations.append("Review pricing strategy to improve competitiveness")
        
        if len(opportunities) > 0:
            recommendations.append(f"Explore {len(opportunities)} identified market opportunities")
        
        return recommendations
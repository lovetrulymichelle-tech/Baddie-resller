"""
Baddie Reseller AI Engine
Main entry point for AI automation and processing
"""

import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Add the ai-engine directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from automation.inventory_predictor import InventoryPredictor
from optimization.price_optimizer import PriceOptimizer
from analysis.market_analyzer import MarketAnalyzer

app = FastAPI(
    title="Baddie Reseller AI Engine",
    description="AI-powered automation and optimization for resellers",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI components
inventory_predictor = InventoryPredictor()
price_optimizer = PriceOptimizer()
market_analyzer = MarketAnalyzer()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Baddie Reseller AI Engine is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "components": {
            "inventory_predictor": "ready",
            "price_optimizer": "ready",
            "market_analyzer": "ready"
        }
    }

@app.post("/predict/inventory")
async def predict_inventory(data: dict):
    """Predict inventory needs"""
    try:
        predictions = await inventory_predictor.predict(data)
        return {"success": True, "predictions": predictions}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/optimize/pricing")
async def optimize_pricing(data: dict):
    """Optimize product pricing"""
    try:
        optimization = await price_optimizer.optimize(data)
        return {"success": True, "optimization": optimization}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/analyze/market")
async def analyze_market(data: dict):
    """Analyze market trends"""
    try:
        analysis = await market_analyzer.analyze(data)
        return {"success": True, "analysis": analysis}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("ENV") == "development" else False
    )
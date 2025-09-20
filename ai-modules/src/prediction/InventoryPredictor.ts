import OpenAI from 'openai';
import { InventoryItem, Product, InventoryPrediction, PredictionFactor } from '../../../shared/src/types';

export class InventoryPredictor {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Predicts inventory demand based on historical data and market trends
   */
  async predictDemand(
    product: Product,
    historicalData: any[],
    timeframe: string = '30d'
  ): Promise<InventoryPrediction> {
    try {
      // Analyze historical sales data
      const salesTrend = this.analyzeSalesTrend(historicalData);
      const seasonality = this.detectSeasonality(historicalData);
      const marketFactors = await this.getMarketFactors(product);

      // Use AI to predict demand
      const aiPrediction = await this.getAIPrediction(product, {
        salesTrend,
        seasonality,
        marketFactors,
        timeframe
      });

      const confidence = this.calculateConfidence(salesTrend, seasonality);
      const suggestedQuantity = this.calculateReorderQuantity(
        aiPrediction.predictedDemand,
        product.inventory.reorderPoint,
        product.inventory.maxStock
      );

      return {
        productId: product.id,
        predictedDemand: aiPrediction.predictedDemand,
        confidence,
        timeframe,
        suggestedReorderQuantity: suggestedQuantity,
        factors: [
          {
            factor: 'Sales Trend',
            impact: salesTrend.impact,
            description: `${salesTrend.direction} trend over last ${timeframe}`
          },
          {
            factor: 'Seasonality',
            impact: seasonality.impact,
            description: seasonality.description
          },
          ...marketFactors.map(factor => ({
            factor: factor.name,
            impact: factor.impact,
            description: factor.description
          }))
        ]
      };
    } catch (error) {
      console.error('Error predicting inventory demand:', error);
      throw new Error('Failed to predict inventory demand');
    }
  }

  /**
   * Analyzes sales trend from historical data
   */
  private analyzeSalesTrend(historicalData: any[]): { direction: string; impact: number } {
    if (historicalData.length < 2) {
      return { direction: 'stable', impact: 0 };
    }

    const recent = historicalData.slice(-7); // Last 7 data points
    const older = historicalData.slice(-14, -7); // Previous 7 data points

    const recentAvg = recent.reduce((sum, item) => sum + item.quantity, 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item.quantity, 0) / older.length;

    const change = (recentAvg - olderAvg) / olderAvg;

    if (change > 0.1) return { direction: 'increasing', impact: Math.min(change, 1) };
    if (change < -0.1) return { direction: 'decreasing', impact: Math.max(change, -1) };
    return { direction: 'stable', impact: 0 };
  }

  /**
   * Detects seasonality patterns
   */
  private detectSeasonality(historicalData: any[]): { impact: number; description: string } {
    // Simple seasonality detection based on month patterns
    const monthlyData = this.groupByMonth(historicalData);
    const currentMonth = new Date().getMonth();
    
    if (monthlyData[currentMonth]) {
      const currentMonthAvg = monthlyData[currentMonth];
      const overallAvg = Object.values(monthlyData).reduce((sum: number, val: number) => sum + val, 0) / Object.keys(monthlyData).length;
      
      const seasonalImpact = (currentMonthAvg - overallAvg) / overallAvg;
      
      return {
        impact: Math.max(-1, Math.min(1, seasonalImpact)),
        description: `Current month shows ${seasonalImpact > 0 ? 'higher' : 'lower'} than average demand`
      };
    }

    return { impact: 0, description: 'No seasonal pattern detected' };
  }

  /**
   * Groups historical data by month
   */
  private groupByMonth(historicalData: any[]): Record<number, number> {
    const monthlyData: Record<number, number[]> = {};
    
    historicalData.forEach(item => {
      const month = new Date(item.date).getMonth();
      if (!monthlyData[month]) monthlyData[month] = [];
      monthlyData[month].push(item.quantity);
    });

    // Calculate averages
    const result: Record<number, number> = {};
    Object.keys(monthlyData).forEach(month => {
      const values = monthlyData[parseInt(month)];
      result[parseInt(month)] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return result;
  }

  /**
   * Gets market factors using AI analysis
   */
  private async getMarketFactors(product: Product): Promise<any[]> {
    try {
      const prompt = `Analyze market factors that could affect demand for this product:
      
      Product: ${product.name}
      Category: ${product.category}
      Description: ${product.description}
      
      Consider current market trends, seasonality, economic factors, and competition.
      Return a JSON array of factors with name, impact (-1 to 1), and description.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch {
          return [];
        }
      }
      return [];
    } catch (error) {
      console.error('Error getting market factors:', error);
      return [];
    }
  }

  /**
   * Gets AI prediction for demand
   */
  private async getAIPrediction(product: Product, context: any): Promise<{ predictedDemand: number }> {
    try {
      const prompt = `Based on the following data, predict the demand for this product over the next ${context.timeframe}:
      
      Product: ${product.name}
      Current Stock: ${product.inventory.currentStock}
      Reorder Point: ${product.inventory.reorderPoint}
      
      Context:
      - Sales Trend: ${context.salesTrend.direction} (impact: ${context.salesTrend.impact})
      - Seasonality Impact: ${context.seasonality.impact}
      - Market Factors: ${JSON.stringify(context.marketFactors)}
      
      Return only a number representing the predicted demand quantity.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      });

      const content = response.choices[0]?.message?.content;
      const predictedDemand = content ? parseInt(content.trim()) : product.inventory.reorderPoint;
      
      return { predictedDemand: Math.max(0, predictedDemand) };
    } catch (error) {
      console.error('Error getting AI prediction:', error);
      // Fallback to simple calculation
      return { predictedDemand: product.inventory.reorderPoint };
    }
  }

  /**
   * Calculates confidence score
   */
  private calculateConfidence(salesTrend: any, seasonality: any): number {
    // Base confidence starts at 0.5
    let confidence = 0.5;
    
    // Adjust based on trend stability
    if (salesTrend.direction === 'stable') confidence += 0.2;
    if (Math.abs(salesTrend.impact) < 0.3) confidence += 0.1;
    
    // Adjust based on seasonality clarity
    if (Math.abs(seasonality.impact) > 0.2) confidence += 0.1;
    
    return Math.min(1, Math.max(0, confidence));
  }

  /**
   * Calculates suggested reorder quantity
   */
  private calculateReorderQuantity(
    predictedDemand: number,
    reorderPoint: number,
    maxStock: number
  ): number {
    // Ensure we don't exceed max stock
    const suggestedQuantity = Math.min(
      predictedDemand * 1.2, // Add 20% buffer
      maxStock - reorderPoint
    );
    
    return Math.max(0, Math.round(suggestedQuantity));
  }
}

export default InventoryPredictor;
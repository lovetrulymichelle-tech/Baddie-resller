import axios, { AxiosInstance } from 'axios';
import { Product, Order, InventoryItem } from '../../../shared/src/types';

export class ShopifyIntegration {
  private api: AxiosInstance;
  private shopDomain: string;

  constructor(shopDomain: string, accessToken: string) {
    this.shopDomain = shopDomain;
    this.api = axios.create({
      baseURL: `https://${shopDomain}.myshopify.com/admin/api/2023-10`,
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Syncs products from Baddie Reseller to Shopify
   */
  async syncProduct(product: Product): Promise<any> {
    try {
      const shopifyProduct = {
        product: {
          title: product.name,
          body_html: product.description,
          vendor: 'Baddie Reseller',
          product_type: product.category,
          handle: this.generateHandle(product.name),
          status: product.isActive ? 'active' : 'draft',
          variants: [
            {
              title: 'Default Title',
              price: product.price.toString(),
              sku: product.sku,
              inventory_quantity: product.inventory.currentStock,
              inventory_management: 'shopify',
              inventory_policy: 'deny'
            }
          ],
          images: product.images.map(url => ({ src: url })),
          metafields: [
            {
              namespace: 'baddie_reseller',
              key: 'product_id',
              value: product.id,
              type: 'single_line_text_field'
            },
            {
              namespace: 'baddie_reseller',
              key: 'cost_price',
              value: product.costPrice.toString(),
              type: 'number_decimal'
            }
          ]
        }
      };

      const response = await this.api.post('/products.json', shopifyProduct);
      return response.data.product;
    } catch (error) {
      console.error('Error syncing product to Shopify:', error);
      throw new Error('Failed to sync product to Shopify');
    }
  }

  /**
   * Updates product inventory in Shopify
   */
  async updateInventory(productId: string, variantId: string, quantity: number): Promise<void> {
    try {
      // Get inventory item ID
      const variantResponse = await this.api.get(`/variants/${variantId}.json`);
      const inventoryItemId = variantResponse.data.variant.inventory_item_id;

      // Get location ID (first location)
      const locationsResponse = await this.api.get('/locations.json');
      const locationId = locationsResponse.data.locations[0].id;

      // Update inventory level
      await this.api.post('/inventory_levels/set.json', {
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: quantity
      });
    } catch (error) {
      console.error('Error updating inventory in Shopify:', error);
      throw new Error('Failed to update inventory in Shopify');
    }
  }

  /**
   * Fetches orders from Shopify
   */
  async fetchOrders(limit: number = 50, status: string = 'any'): Promise<any[]> {
    try {
      const response = await this.api.get('/orders.json', {
        params: {
          limit,
          status,
          fulfillment_status: 'any',
          financial_status: 'any'
        }
      });

      return response.data.orders;
    } catch (error) {
      console.error('Error fetching orders from Shopify:', error);
      throw new Error('Failed to fetch orders from Shopify');
    }
  }

  /**
   * Creates a webhook in Shopify
   */
  async createWebhook(topic: string, address: string): Promise<any> {
    try {
      const webhook = {
        webhook: {
          topic,
          address,
          format: 'json'
        }
      };

      const response = await this.api.post('/webhooks.json', webhook);
      return response.data.webhook;
    } catch (error) {
      console.error('Error creating webhook in Shopify:', error);
      throw new Error('Failed to create webhook in Shopify');
    }
  }

  /**
   * Verifies Shopify webhook
   */
  verifyWebhook(data: string, hmacHeader: string, secret: string): boolean {
    const crypto = require('crypto');
    const calculatedHmac = crypto
      .createHmac('sha256', secret)
      .update(data, 'utf8')
      .digest('base64');

    return calculatedHmac === hmacHeader;
  }

  /**
   * Converts Shopify order to Baddie Reseller order format
   */
  convertShopifyOrder(shopifyOrder: any): Partial<Order> {
    return {
      orderNumber: shopifyOrder.order_number?.toString(),
      customerId: shopifyOrder.customer?.id?.toString(),
      totalAmount: parseFloat(shopifyOrder.total_price),
      status: this.mapShopifyOrderStatus(shopifyOrder.fulfillment_status),
      paymentStatus: this.mapShopifyPaymentStatus(shopifyOrder.financial_status),
      items: shopifyOrder.line_items?.map((item: any) => ({
        productId: item.sku, // Assuming SKU maps to our product ID
        quantity: item.quantity,
        unitPrice: parseFloat(item.price),
        totalPrice: parseFloat(item.price) * item.quantity
      })),
      shippingAddress: this.convertShopifyAddress(shopifyOrder.shipping_address),
      billingAddress: this.convertShopifyAddress(shopifyOrder.billing_address),
      createdAt: new Date(shopifyOrder.created_at),
      updatedAt: new Date(shopifyOrder.updated_at)
    };
  }

  /**
   * Fulfills an order in Shopify
   */
  async fulfillOrder(orderId: string, trackingNumber?: string, trackingCompany?: string): Promise<any> {
    try {
      const fulfillment = {
        fulfillment: {
          location_id: await this.getDefaultLocationId(),
          tracking_number: trackingNumber,
          tracking_company: trackingCompany,
          notify_customer: true
        }
      };

      const response = await this.api.post(`/orders/${orderId}/fulfillments.json`, fulfillment);
      return response.data.fulfillment;
    } catch (error) {
      console.error('Error fulfilling order in Shopify:', error);
      throw new Error('Failed to fulfill order in Shopify');
    }
  }

  /**
   * Gets all products from Shopify
   */
  async getAllProducts(limit: number = 250): Promise<any[]> {
    try {
      const response = await this.api.get('/products.json', {
        params: { limit }
      });

      return response.data.products;
    } catch (error) {
      console.error('Error fetching products from Shopify:', error);
      throw new Error('Failed to fetch products from Shopify');
    }
  }

  // Helper methods
  private generateHandle(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private mapShopifyOrderStatus(fulfillmentStatus: string): any {
    const statusMap: Record<string, any> = {
      'fulfilled': 'delivered',
      'partial': 'processing',
      'restocked': 'returned',
      null: 'pending'
    };
    return statusMap[fulfillmentStatus] || 'pending';
  }

  private mapShopifyPaymentStatus(financialStatus: string): any {
    const statusMap: Record<string, any> = {
      'paid': 'paid',
      'pending': 'pending',
      'refunded': 'refunded',
      'partially_refunded': 'partially_refunded',
      'voided': 'failed'
    };
    return statusMap[financialStatus] || 'pending';
  }

  private convertShopifyAddress(address: any): any {
    if (!address) return null;
    
    return {
      street: `${address.address1} ${address.address2 || ''}`.trim(),
      city: address.city,
      state: address.province,
      zipCode: address.zip,
      country: address.country
    };
  }

  private async getDefaultLocationId(): Promise<string> {
    try {
      const response = await this.api.get('/locations.json');
      return response.data.locations[0]?.id;
    } catch (error) {
      throw new Error('Failed to get default location');
    }
  }
}

export default ShopifyIntegration;
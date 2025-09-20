import React from 'react'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  lastUpdated: string
}

interface ProductListProps {
  products: Product[]
  onEditProduct: (productId: string) => void
  onDeleteProduct: (productId: string) => void
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEditProduct,
  onDeleteProduct
}) => {
  const getStatusBadge = (status: Product['status']) => {
    const statusConfig = {
      active: { color: '#10b981', text: 'Active' },
      inactive: { color: '#6b7280', text: 'Inactive' },
      out_of_stock: { color: '#ef4444', text: 'Out of Stock' }
    }
    
    const config = statusConfig[status]
    return (
      <span 
        className="status-badge"
        style={{ backgroundColor: config.color }}
      >
        {config.text}
      </span>
    )
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Product Management</h2>
        <button className="btn-primary">+ Add Product</button>
      </div>
      
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No products yet</h3>
          <p>Start by adding your first product to begin selling!</p>
          <button className="btn-primary">Add Your First Product</button>
        </div>
      ) : (
        <div className="product-table">
          <div className="table-header">
            <div>Product</div>
            <div>SKU</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          
          {products.map((product) => (
            <div key={product.id} className="table-row">
              <div className="product-info">
                <strong>{product.name}</strong>
                <small>{product.lastUpdated}</small>
              </div>
              <div>{product.sku}</div>
              <div>${product.price.toFixed(2)}</div>
              <div>{product.stock}</div>
              <div>{getStatusBadge(product.status)}</div>
              <div className="actions">
                <button 
                  onClick={() => onEditProduct(product.id)}
                  className="btn-secondary"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteProduct(product.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList
import React, { useState } from 'react'
import DashboardStats from './DashboardStats'
import ProductList from './ProductList'
import QuickActions from './QuickActions'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  lastUpdated: string
}

const MainDashboard: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Wireless Bluetooth Earbuds',
      sku: 'WBE-001',
      price: 29.99,
      stock: 150,
      status: 'active',
      lastUpdated: 'Updated 2 hours ago'
    },
    {
      id: '2',
      name: 'Phone Case Collection',
      sku: 'PCC-002',
      price: 12.99,
      stock: 0,
      status: 'out_of_stock',
      lastUpdated: 'Updated 1 day ago'
    },
    {
      id: '3',
      name: 'Fitness Tracker Band',
      sku: 'FTB-003',
      price: 45.99,
      stock: 75,
      status: 'active',
      lastUpdated: 'Updated 3 hours ago'
    }
  ])

  const handleEditProduct = (productId: string) => {
    console.log('Edit product:', productId)
    // TODO: Implement product editing
  }

  const handleDeleteProduct = (productId: string) => {
    console.log('Delete product:', productId)
    // TODO: Implement product deletion
  }

  const stats = {
    totalProducts: products.length,
    activeListings: products.filter(p => p.status === 'active').length,
    todaysRevenue: 1247.83,
    pendingOrders: 12
  }

  return (
    <div className="main-dashboard">
      <div className="dashboard-header">
        <h1>Reseller Dashboard</h1>
        <p>Manage your products, optimize pricing, and grow your business</p>
      </div>
      
      <div className="dashboard-content">
        <DashboardStats {...stats} />
        
        <div className="dashboard-grid">
          <div className="dashboard-main">
            <ProductList 
              products={products}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
          
          <div className="dashboard-sidebar">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainDashboard
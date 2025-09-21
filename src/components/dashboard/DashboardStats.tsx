import React from 'react'

interface DashboardStatsProps {
  totalProducts: number
  activeListings: number
  todaysRevenue: number
  pendingOrders: number
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalProducts,
  activeListings,
  todaysRevenue,
  pendingOrders
}) => {
  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: '📦',
      color: '#3b82f6'
    },
    {
      title: 'Active Listings',
      value: activeListings,
      icon: '🏷️',
      color: '#10b981'
    },
    {
      title: "Today's Revenue",
      value: `$${todaysRevenue.toFixed(2)}`,
      icon: '💰',
      color: '#f59e0b'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: '📋',
      color: '#ef4444'
    }
  ]

  return (
    <div className="dashboard-stats">
      <h2>Business Overview</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardStats
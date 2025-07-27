import React, { useState, useEffect } from 'react';
import { FaDollarSign, FaShoppingCart, FaUsers, FaBook } from 'react-icons/fa';

import { StatCard } from '../components/admin/StatCard';
import { SalesChart } from '../components/admin/SalesChart';
import { RecentOrdersTable } from '../components/admin/RecentOrdersTable';
// Assume your API service is set up
// import { getDashboardStats, getSalesReport, getRecentOrders } from '../services/api';

// --- Mock Data (Replace with API calls) ---
const mockStats = {
  totalSales: 45231.89,
  newOrders: 350,
  newUsers: 82,
  totalBooks: 1250,
};

const mockSalesData = [
  { month: 'January', sales: 4500 },
  { month: 'February', sales: 5200 },
  { month: 'March', sales: 7100 },
  { month: 'April', sales: 6200 },
  { month: 'May', sales: 8000 },
  { month: 'June', sales: 9300 },
];

const mockRecentOrders = [
  { id: 1024, customerName: 'John Doe', total: 75.50, status: 'Completed' },
  { id: 1023, customerName: 'Jane Smith', total: 120.00, status: 'Pending' },
  { id: 1022, customerName: 'Sam Wilson', total: 45.25, status: 'Completed' },
  { id: 1021, customerName: 'Bucky Barnes', total: 210.80, status: 'Cancelled' },
  { id: 1020, customerName: 'Peter Parker', total: 88.40, status: 'Completed' },
];
// --- End Mock Data ---


export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch data here
    const fetchData = async () => {
      try {
        // Example of real API calls:
        // const statsPromise = getDashboardStats();
        // const salesPromise = getSalesReport();
        // const ordersPromise = getRecentOrders();
        // const [statsRes, salesRes, ordersRes] = await Promise.all([statsPromise, salesPromise, ordersPromise]);

        // Using mock data for this example
        setStats(mockStats);
        setSalesData(mockSalesData);
        setRecentOrders(mockRecentOrders);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          icon={<FaDollarSign size={24} />}
          colorClass="bg-green-500"
        />
        <StatCard
          title="New Orders"
          value={stats.newOrders}
          icon={<FaShoppingCart size={24} />}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="New Users"
          value={stats.newUsers}
          icon={<FaUsers size={24} />}
          colorClass="bg-purple-500"
        />
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<FaBook size={24} />}
          colorClass="bg-red-500"
        />
      </div>

      {/* Main Content: Chart and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesChart salesData={salesData} />
        </div>
        <div>
          <RecentOrdersTable orders={recentOrders} />
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChartBarIcon,
  CubeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CogIcon,
  TagIcon,
  TruckIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import Dispatch from './Dispatch';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 150,
    pendingOrders: 25,
    totalProducts: 432,
    totalRevenue: 25999.99,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'products', name: 'Products', icon: CubeIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'dispatch', name: 'Dispatch', icon: TruckIcon },
    { id: 'customers', name: 'Customers', icon: UsersIcon },
    { id: 'invoices', name: 'Invoices', icon: DocumentTextIcon },
    { id: 'pricing', name: 'Pricing', icon: TagIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
  ];

  const StatCard: React.FC<{ title: string; value: string | number; icon: any }> = ({
    title,
    value,
    icon: Icon,
  }) => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white min-h-screen shadow-sm fixed left-0 top-0 z-10">
          <div className="p-6">
            <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-6">
              Admin Dashboard
            </h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              ))}
              <div className="pt-8 border-t mt-8">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard Overview</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={ShoppingBagIcon}
                />
                <StatCard
                  title="Pending Orders"
                  value={stats.pendingOrders}
                  icon={TruckIcon}
                />
                <StatCard
                  title="Total Products"
                  value={stats.totalProducts}
                  icon={CubeIcon}
                />
                <StatCard
                  title="Total Revenue"
                  value={`$${stats.totalRevenue.toLocaleString()}`}
                  icon={ChartBarIcon}
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                  {/* Add recent activity list here */}
                </div>
              </div>
            </div>
          )}

          {/* Product Management */}
          {activeTab === 'products' && <ProductManagement />}

          {/* Order Management */}
          {activeTab === 'orders' && <OrderManagement />}

          {/* Dispatch Management */}
          {activeTab === 'dispatch' && <Dispatch />}

          {/* Other sections */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-900">Customer Management</h1>
              {/* Add customer management content */}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-900">Invoice Management</h1>
              {/* Add invoice management content */}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-900">Pricing Management</h1>
              {/* Add pricing management content */}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              {/* Add settings content */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
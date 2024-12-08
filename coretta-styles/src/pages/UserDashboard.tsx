import React, { useState } from 'react';
import {
  UserIcon,
  CreditCardIcon,
  HeartIcon,
  ShoppingBagIcon,
  CalendarIcon,
  StarIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import PaymentMethods from '../components/dashboard/PaymentMethods';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  about: string;
  website: string;
  location: string;
  loyaltyPoints: number;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: 'temp_account@test.com',
    phone: '',
    mobile: '',
    about: '',
    website: '',
    location: '',
    loyaltyPoints: 0
  });

  const sidebarItems = [
    { id: 'profile', name: 'My Profile', icon: UserIcon },
    { id: 'orders', name: 'My Orders', icon: ShoppingBagIcon },
    { id: 'payments', name: 'Payment Methods', icon: CreditCardIcon },
    { id: 'wishlist', name: 'Wishlist', icon: HeartIcon },
    { id: 'calendar', name: 'Calendar', icon: CalendarIcon },
    { id: 'loyalty', name: 'Loyalty Program', icon: StarIcon },
  ];

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile updated:', profile);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden">
                <img
                  src="https://placehold.co/100x100"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {profile.firstName || 'User'} {profile.lastName}
                </h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t">
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                Log Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-8">
            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-medium text-gray-900">My Profile</h2>
                  <div className="relative">
                    <BellIcon className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      5
                    </span>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        value={profile.mobile}
                        placeholder="+1 232 3232"
                        onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Me
                    </label>
                    <textarea
                      value={profile.about}
                      onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Loyalty Program Section */}
            {activeTab === 'loyalty' && (
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-8">Loyalty Program</h2>
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-6 text-white mb-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-80">Available Points</p>
                      <p className="text-3xl font-bold">{profile.loyaltyPoints}</p>
                    </div>
                    <StarIcon className="w-12 h-12 opacity-50" />
                  </div>
                </div>
                {/* Add more loyalty program features here */}
              </div>
            )}

            {/* Payment Methods Section */}
            {activeTab === 'payments' && (
              <PaymentMethods />
            )}

            {/* Orders Section */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-8">My Orders</h2>
                {/* Add orders list here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
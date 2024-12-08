import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import CategoryPage from './pages/CategoryPage';
import ChatInterface from './components/ChatInterface';
import Cart from './pages/Cart';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './styles/navbar.css';

// Navigation structure
export const navigationStructure = {
  womens: {
    label: "Women's",
    subcategories: {
      clothing: {
        label: 'Clothing',
        items: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Activewear', 'Swimwear', 'Loungewear']
      },
      shoes: {
        label: 'Shoes',
        items: ['Heels', 'Flats', 'Sneakers', 'Boots', 'Sandals']
      },
      accessories: {
        label: 'Accessories',
        items: ['Bags', 'Jewelry', 'Belts', 'Scarves', 'Sunglasses']
      }
    }
  },
  mens: {
    label: "Men's",
    subcategories: {
      clothing: {
        label: 'Clothing',
        items: ['Shirts', 'T-Shirts', 'Pants', 'Outerwear', 'Activewear', 'Swimwear']
      },
      shoes: {
        label: 'Shoes',
        items: ['Sneakers', 'Boots', 'Dress Shoes', 'Sandals']
      },
      accessories: {
        label: 'Accessories',
        items: ['Bags', 'Watches', 'Belts', 'Ties', 'Sunglasses']
      }
    }
  },
  kids: {
    label: "Kids",
    subcategories: {
      girls: {
        label: 'Girls',
        items: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Activewear']
      },
      boys: {
        label: 'Boys',
        items: ['Shirts', 'T-Shirts', 'Pants', 'Outerwear', 'Activewear']
      },
      shoes: {
        label: 'Shoes',
        items: ['Girls Shoes', 'Boys Shoes']
      }
    }
  },
  beauty: {
    label: "Beauty",
    subcategories: {
      makeup: {
        label: 'Makeup',
        items: ['Face', 'Eyes', 'Lips', 'Brushes']
      },
      skincare: {
        label: 'Skincare',
        items: ['Cleansers', 'Moisturizers', 'Treatments', 'Sunscreen']
      },
      fragrance: {
        label: 'Fragrance',
        items: ['Women', 'Men', 'Unisex']
      }
    }
  }
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else if (adminOnly && !user?.isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, adminOnly, navigate]);

  if (!isAuthenticated || (adminOnly && !user?.isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar navigationStructure={navigationStructure} />
      <div className="pt-32 px-8">
        <Routes>
          <Route path="/" element={
            <>
              <ProductGrid products={[]} />
              <div className="fixed bottom-8 right-8 w-96">
                <ChatInterface />
              </div>
            </>
          } />
          <Route path="/cart" element={<Cart />} />
          
          {/* Dynamic Category Routes */}
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/:category/:subcategory" element={<CategoryPage />} />
          <Route path="/:category/:subcategory/:item" element={<CategoryPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

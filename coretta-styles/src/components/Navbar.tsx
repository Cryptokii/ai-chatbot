import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import LoginModal from './LoginModal';

interface NavbarProps {
  navigationStructure: {
    [key: string]: {
      label: string;
      subcategories: {
        [key: string]: {
          label: string;
          items: string[];
        };
      };
    };
  };
}

const Navbar: React.FC<NavbarProps> = ({ navigationStructure }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cartCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const handleCategoryHover = (category: string) => {
    setActiveCategory(category);
    setActiveSubcategory(null);
  };

  const handleSubcategoryHover = (subcategory: string) => {
    setActiveSubcategory(subcategory);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 py-4 border-b">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="text-3xl font-serif tracking-wider">
            CORETTA
          </Link>
        </div>

        {/* Search and Icons */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-transparent border-b border-gray-200 py-1 px-2 text-sm focus:outline-none focus:border-black transition-colors w-32"
            />
            <MagnifyingGlassIcon className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
          
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="hover:opacity-70 transition-opacity"
          >
            <UserIcon className="w-6 h-6" />
          </button>

          <Link to="/cart" className="relative hover:opacity-70 transition-opacity">
            <ShoppingBagIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="relative" onMouseLeave={handleMouseLeave}>
        {/* Category Links */}
        <div className="flex justify-center space-x-8 py-4 px-8 text-sm">
          {Object.entries(navigationStructure).map(([key, category]) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => handleCategoryHover(key)}
            >
              <Link
                to={`/${key}`}
                className="hover:opacity-70 transition-opacity uppercase"
              >
                {category.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Mega Menu */}
        {activeCategory && (
          <div className="absolute left-0 right-0 bg-white border-t border-gray-100 shadow-lg animate-fade-in">
            <div className="container mx-auto px-8 py-6">
              <div className="grid grid-cols-4 gap-8">
                {Object.entries(navigationStructure[activeCategory].subcategories).map(([key, subcategory]) => (
                  <div
                    key={key}
                    className="space-y-4"
                    onMouseEnter={() => handleSubcategoryHover(key)}
                  >
                    <Link
                      to={`/${activeCategory}/${key}`}
                      className="block font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      {subcategory.label}
                    </Link>
                    <ul className="space-y-2">
                      {subcategory.items.map((item) => (
                        <li key={item}>
                          <Link
                            to={`/${activeCategory}/${key}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
};

export default Navbar;
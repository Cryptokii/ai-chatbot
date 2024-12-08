import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { navigationStructure } from '../App';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  colors: string[];
  sizes: string[];
  category: string;
}

interface Breadcrumb {
  label: string;
  path: string;
}

type NavigationCategory = {
  label: string;
  subcategories: {
    [key: string]: {
      label: string;
      items: string[];
    };
  };
};

type NavigationStructure = {
  [key: string]: NavigationCategory;
};

const CategoryPage: React.FC = () => {
  const { category, subcategory, item } = useParams<{
    category: string;
    subcategory?: string;
    item?: string;
  }>();
  const location = useLocation();
  const [selectedFilters, setSelectedFilters] = useState({
    color: [] as string[],
    size: [] as string[],
    price: '',
    sort: 'newest'
  });

  // Get category information
  const categoryInfo = category ? (navigationStructure as NavigationStructure)[category] : null;
  const subcategoryInfo = categoryInfo && subcategory ? categoryInfo.subcategories[subcategory] : null;

  // Generate breadcrumb
  const generateBreadcrumb = (): Breadcrumb[] => {
    const crumbs: Breadcrumb[] = [];
    
    if (category && categoryInfo) {
      crumbs.push({
        label: categoryInfo.label,
        path: `/${category}`
      });
    }

    if (subcategory && subcategoryInfo) {
      crumbs.push({
        label: subcategoryInfo.label,
        path: `/${category}/${subcategory}`
      });
    }

    if (item) {
      crumbs.push({
        label: item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        path: location.pathname
      });
    }

    return crumbs;
  };

  const breadcrumb = generateBreadcrumb();

  // Sample products data - in real app, this would come from an API based on the category/subcategory/item
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: `${categoryInfo?.label || ''} ${subcategoryInfo?.label || ''} Item 1`,
      price: 79.99,
      originalPrice: 129.99,
      discount: 38,
      image: `https://via.placeholder.com/300x400/87CEEB/000000?text=${category || ''}+${subcategory || ''}`,
      colors: ['Black', 'White', 'Blue'],
      sizes: ['S', 'M', 'L', 'XL'],
      category: category || ''
    },
    // Add more sample products...
  ];

  const filters = {
    color: ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Brown'],
    size: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    price: ['Under $50', '$50-$100', '$100-$200', 'Over $200'],
    sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling']
  };

  const toggleFilter = (type: string, value: string) => {
    setSelectedFilters(prev => {
      if (type === 'price' || type === 'sort') {
        return { ...prev, [type]: value };
      }
      const currentFilters = prev[type as 'color' | 'size'];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(f => f !== value)
        : [...currentFilters, value];
      return { ...prev, [type]: newFilters };
    });
  };

  if (!category || !categoryInfo) {
    return <div>Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-gray-900">Home</a>
        {breadcrumb.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <span>/</span>
            <a
              href={crumb.path}
              className={`${
                index === breadcrumb.length - 1
                  ? 'text-gray-900 font-medium'
                  : 'hover:text-gray-900'
              }`}
            >
              {crumb.label}
            </a>
          </React.Fragment>
        ))}
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light">
          {item
            ? item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            : subcategoryInfo?.label || categoryInfo.label}
        </h1>
        <p className="text-gray-600 mt-2">
          Online Only | Up to 80% Off Markdowns
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-32">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">FILTER</h2>
              <button 
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setSelectedFilters({
                  color: [],
                  size: [],
                  price: '',
                  sort: 'newest'
                })}
              >
                CLEAR ALL
              </button>
            </div>

            {/* Color Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">COLOR</h3>
              <div className="space-y-2">
                {filters.color.map(color => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters.color.includes(color)}
                      onChange={() => toggleFilter('color', color)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">SIZE</h3>
              <div className="space-y-2">
                {filters.size.map(size => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters.size.includes(size)}
                      onChange={() => toggleFilter('size', size)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">PRICE</h3>
              <div className="space-y-2">
                {filters.price.map(range => (
                  <label key={range} className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedFilters.price === range}
                      onChange={() => toggleFilter('price', range)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="flex justify-end mb-6">
            <select
              value={selectedFilters.sort}
              onChange={(e) => toggleFilter('sort', e.target.value)}
              className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {filters.sort.map(option => (
                <option key={option} value={option.toLowerCase()}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleProducts.map(product => (
              <div key={product.id} className="group relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                  <button className="absolute top-2 right-2 p-2">
                    <HeartIcon className="w-6 h-6 stroke-black hover:fill-black/10" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-full text-sm font-medium">
                      QUICK VIEW
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-red-600">
                      {product.discount}% OFF
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {product.colors.map(color => (
                      <div
                        key={color}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
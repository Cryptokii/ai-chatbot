import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  image: string;
  color?: string;
  size?: string;
  department?: string;
}

interface ProductGridProps {
  products: Product[];
  columns?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, columns = 4 }) => {
  const { addItem } = useCart();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {products.map(product => (
          <div key={product.id} className="group relative">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 p-2 z-10"
              >
                <HeartIcon
                  className={`w-6 h-6 transition-colors ${
                    favorites.has(product.id)
                      ? 'fill-black stroke-black'
                      : 'stroke-black hover:fill-black/10'
                  }`}
                />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-900">
                {product.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discount && (
                  <span className="text-sm text-red-600">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-black text-white py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
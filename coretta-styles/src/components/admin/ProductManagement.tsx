import React, { useState, useEffect } from 'react';
import AddProductForm from './AddProductForm';
import { 
  PlusIcon, 
  TableCellsIcon,
  PencilIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import ProductService, { Product } from '../../services/product.service';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<'list' | 'add'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const loadedProducts = await ProductService.getProducts();
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setView('add');
  };

  const handleDelete = async (id: string) => {
    try {
      await ProductService.deleteProduct(id);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleProductSubmit = async (productData: FormData) => {
    try {
      if (selectedProduct) {
        const updatedProduct = await ProductService.updateProduct(selectedProduct._id!, productData);
        setProducts(products.map(p => p._id === selectedProduct._id ? updatedProduct : p));
      } else {
        const newProduct = await ProductService.addProduct(productData);
        setProducts([...products, newProduct]);
      }
      setView('list');
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light">Product Management</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setView('list')}
            className={`flex items-center px-4 py-2 rounded-md ${
              view === 'list'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TableCellsIcon className="w-5 h-5 mr-2" />
            View Products
          </button>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setView('add');
            }}
            className={`flex items-center px-4 py-2 rounded-md ${
              view === 'add'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {view === 'add' ? (
        <AddProductForm 
          onSubmit={handleProductSubmit}
          initialProduct={selectedProduct}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded-lg"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => product._id && handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
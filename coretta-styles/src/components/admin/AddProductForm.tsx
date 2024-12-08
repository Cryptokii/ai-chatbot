import React, { useState, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Product } from '../../services/product.service';

interface AddProductFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialProduct?: Product | null;
}

const CATEGORIES = [
  'Dresses',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Accessories',
  'Shoes',
  'Sale'
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray'];

const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit, initialProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    stockQuantity: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        description: initialProduct.description,
        price: initialProduct.price.toString(),
        category: initialProduct.category,
        sizes: initialProduct.sizes,
        colors: initialProduct.colors,
        stockQuantity: initialProduct.stock.toString()
      });
      // If there are image URLs, create previews
      if (initialProduct.images && initialProduct.images.length > 0) {
        setPreviewUrls(initialProduct.images);
      }
    }
  }, [initialProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setImages(files);
    setError('');
  };

  const handleCheckboxChange = (type: 'sizes' | 'colors', value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.category || (images.length === 0 && !initialProduct)) {
      setError('Please fill in all required fields and add at least one image');
      return;
    }

    if (formData.sizes.length === 0 || formData.colors.length === 0) {
      setError('Please select at least one size and color');
      return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value);
        }
      });
      
      images.forEach((image, index) => {
        submitData.append(`image${index}`, image);
      });

      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        sizes: [],
        colors: [],
        stockQuantity: ''
      });
      setImages([]);
      setPreviewUrls([]);
      setError('');
    } catch (error) {
      setError('Failed to add product. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-light mb-6">
        {initialProduct ? 'Edit Product' : 'Add New Product'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (£) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images * (Maximum 4)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="images" className="relative cursor-pointer rounded-md font-medium text-black hover:text-gray-700">
                <span>Upload images</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
          </div>
        </div>

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Sizes *
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {SIZES.map(size => (
            <label key={size} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.sizes.includes(size)}
                onChange={() => handleCheckboxChange('sizes', size)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Colors *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {COLORS.map(color => (
            <label key={color} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.colors.includes(color)}
                onChange={() => handleCheckboxChange('colors', color)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">{color}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          {initialProduct ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;

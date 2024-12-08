import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

class ProductService {
  async addProduct(formData: FormData): Promise<Product> {
    try {
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(id: string, formData: FormData): Promise<Product> {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProducts(category?: string): Promise<Product[]> {
    try {
      const url = category 
        ? `${API_URL}/products?category=${category}`
        : `${API_URL}/products`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.message || 'An error occurred while processing your request');
    }
    return error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}

export default new ProductService();

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AuthService from '../../services/auth.service';

interface AdminLoginProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // If used as a modal and not open, return null
  if (isOpen !== undefined && !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await AuthService.adminLogin(formData.email, formData.password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isAdmin', 'true');
      
      if (onClose) {
        onClose();
      }
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Admin authentication failed');
    }
  };

  // Render content that's common between modal and standalone page
  const renderContent = () => (
    <>
      <h2 className="text-2xl font-light mb-6 text-center">ADMIN LOGIN</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 text-sm hover:bg-gray-900 transition-colors"
        >
          LOGIN AS ADMIN
        </button>
      </form>
    </>
  );

  // If used as a modal
  if (isOpen !== undefined) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-md p-8 relative animate-slide-up">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          {renderContent()}
        </div>
      </div>
    );
  }

  // If used as a standalone page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md p-8 shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminLogin;
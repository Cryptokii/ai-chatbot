import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import PasswordResetModal from './PasswordResetModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const response = await AuthService.login(formData.email, formData.password);
        login(response.token, response.user);
      } else {
        const response = await AuthService.register(formData.name, formData.email, formData.password);
        login(response.token, response.user);
      }
      onClose();
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-md p-8 relative animate-slide-up">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-light mb-6 text-center">
            {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                required
              />
            )}
            <input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 text-sm hover:bg-gray-900 transition-colors"
            >
              {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 text-center space-y-2">
              <button
                onClick={() => setShowResetModal(true)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot your password?
              </button>
              <div>
                <Link 
                  to="/admin/login" 
                  onClick={onClose}
                  className="text-sm text-gray-600 hover:text-gray-900 block mt-2"
                >
                  Login as Admin?
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <PasswordResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </>
  );
};

export default LoginModal;
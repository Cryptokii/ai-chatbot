import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AuthService from '../services/auth.service';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await AuthService.requestPasswordReset(email);
      setMessage({ 
        type: 'success', 
        text: 'Password reset instructions have been sent to your email' 
      });
      setTimeout(() => {
        onClose();
        setEmail('');
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to send reset instructions' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-8 relative animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-light mb-4 text-center">Reset Password</h2>
        <p className="text-gray-600 text-sm text-center mb-8">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        {message.text && (
          <div className={`mb-4 p-3 text-sm text-center ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700' 
              : 'bg-green-50 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black transition-colors"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-black text-white py-3 text-sm transition-all ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:bg-gray-900'
            }`}
          >
            {isLoading ? (
              <span className="inline-block animate-pulse">
                SENDING INSTRUCTIONS...
              </span>
            ) : (
              'SEND INSTRUCTIONS'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetModal; 
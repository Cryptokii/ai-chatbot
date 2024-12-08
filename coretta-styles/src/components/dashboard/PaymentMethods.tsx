import React, { useState } from 'react';
import { PlusIcon, CreditCardIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PaymentMethod {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const PaymentMethods: React.FC = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      cardNumber: '**** **** **** 4242',
      expiryDate: '12/24',
      cardholderName: 'John Doe',
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
    },
  ]);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement card addition logic
    setShowAddCard(false);
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-medium text-gray-900">Payment Methods</h2>
        <button
          onClick={() => setShowAddCard(true)}
          className="flex items-center px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Card
        </button>
      </div>

      {/* Existing Cards */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <CreditCardIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{method.cardNumber}</p>
                  <p className="text-sm text-gray-500">
                    Expires {method.expiryDate} • {method.cardholderName}
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{method.billingAddress.street}</p>
                    <p>
                      {method.billingAddress.city}, {method.billingAddress.state}{' '}
                      {method.billingAddress.zipCode}
                    </p>
                    <p>{method.billingAddress.country}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCard(method.id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Card Form */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Add New Payment Method</h3>
            <form onSubmit={handleAddCard} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="**** **** **** ****"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="***"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Billing Address</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods; 
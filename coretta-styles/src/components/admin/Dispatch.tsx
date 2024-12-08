import React, { useState } from 'react';
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';

interface DispatchOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  status: 'pending' | 'processing' | 'ready' | 'dispatched';
  items: {
    id: string;
    name: string;
    quantity: number;
    sku: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  carrier?: string;
}

const Dispatch: React.FC = () => {
  const [orders, setOrders] = useState<DispatchOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      date: '2023-12-04',
      status: 'pending',
      items: [
        {
          id: '1',
          name: 'Evening Gown',
          quantity: 1,
          sku: 'EG-001',
        },
        {
          id: '2',
          name: 'Clutch Bag',
          quantity: 1,
          sku: 'CB-001',
        },
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<DispatchOrder | null>(null);
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: '',
    carrier: '',
  });

  const getStatusColor = (status: DispatchOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'dispatched':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: DispatchOrder['status']) => {
    switch (status) {
      case 'pending':
        return ClockIcon;
      case 'processing':
        return ClockIcon;
      case 'ready':
        return CheckCircleIcon;
      case 'dispatched':
        return TruckIcon;
      default:
        return ClockIcon;
    }
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrder) {
      setOrders(prev =>
        prev.map(order =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: 'dispatched',
                trackingNumber: trackingInfo.trackingNumber,
                carrier: trackingInfo.carrier,
              }
            : order
        )
      );
      setShowDispatchForm(false);
      setTrackingInfo({ trackingNumber: '', carrier: '' });
      // TODO: Implement API call to update order dispatch status
    }
  };

  const printPackingSlip = (order: DispatchOrder) => {
    // TODO: Implement packing slip generation and printing
    console.log('Printing packing slip for order:', order.orderNumber);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dispatch Management</h1>
      </div>

      {/* Order Dispatch Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {(['pending', 'processing', 'ready', 'dispatched'] as const).map(status => (
          <div key={status} className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 capitalize">
              {status}
            </h2>
            <div className="space-y-4">
              {orders
                .filter(order => order.status === status)
                .map(order => (
                  <div
                    key={order.id}
                    className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.customerName}</p>
                      </div>
                      <div className="flex space-x-2">
                        {status === 'ready' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDispatchForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <TruckIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => printPackingSlip(order)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <PrinterIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} items
                    </div>
                    {order.trackingNumber && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Tracking:</span>{' '}
                        {order.trackingNumber}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Form Modal */}
      {showDispatchForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Dispatch Order - {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowDispatchForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleDispatch} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier
                </label>
                <select
                  value={trackingInfo.carrier}
                  onChange={e =>
                    setTrackingInfo({ ...trackingInfo, carrier: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Carrier</option>
                  <option value="fedex">FedEx</option>
                  <option value="ups">UPS</option>
                  <option value="usps">USPS</option>
                  <option value="dhl">DHL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingInfo.trackingNumber}
                  onChange={e =>
                    setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowDispatchForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dispatch; 
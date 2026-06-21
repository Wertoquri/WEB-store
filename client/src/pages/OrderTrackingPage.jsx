import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const statusConfig = {
  pending: { class: 'pending', label: 'Очікується' },
  processing: { class: 'processing', label: 'Обробляється' },
  shipped: { class: 'shipped', label: 'Відправлено' },
  delivered: { class: 'delivered', label: 'Доставлено' },
  cancelled: { class: 'cancelled', label: 'Скасовано' }
};

const OrderTrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);

    if (!trackingNumber.trim()) {
      setError('Введіть номер замовлення');
      return;
    }

    setLoading(true);

    try {
      const response = await ordersAPI.getById(trackingNumber.trim());
      setOrder(response.data);
    } catch (err) {
      const message = err.response?.status === 404
        ? 'Замовлення не знайдено. Перевірте номер і спробуйте знову.'
        : err.response?.data?.message || 'Не вдалося завантажити замовлення';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const statusIcons = {
    pending: <Clock className="w-5 h-5" />,
    processing: <Package className="w-5 h-5" />,
    shipped: <Truck className="w-5 h-5" />,
    delivered: <CheckCircle className="w-5 h-5" />,
    cancelled: <AlertCircle className="w-5 h-5" />
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-orange-100 text-orange-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#075985] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Відстеження замовлення
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Введіть номер замовлення для відстеження статусу доставки
          </p>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleTrack} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Введіть номер замовлення
              </h2>

              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Наприклад: 12345"
                    className="w-full px-6 py-4 pl-12 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all text-lg"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:shadow-xl px-8 py-4 text-lg"
                >
                  {loading ? 'Пошук...' : 'Відстежити'}
                </Button>
              </div>

              {error && <ErrorMessage message={error} />}

              <p className="text-sm text-gray-500 text-center mt-4">
                Номер замовлення вказано у листі-підтвердженні
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Order Results */}
      {order && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Замовлення #{order.id}</h3>
                    <p className="text-gray-500">Дата замовлення: {new Date(order.createdAt).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {statusIcons[order.status] || <Clock className="w-5 h-5" />}
                    <span className="font-semibold">{statusConfig[order.status]?.label || order.status}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                {order.carrier && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Truck className="w-6 h-6 text-[#0284c7]" />
                      <div>
                        <p className="text-sm text-gray-500">Перевізник</p>
                        <p className="font-semibold text-gray-900">{order.carrier}</p>
                      </div>
                    </div>
                    {order.trackingCode && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <MapPin className="w-6 h-6 text-[#0284c7]" />
                        <div>
                          <p className="text-sm text-gray-500">Трек-код</p>
                          <p className="font-semibold text-gray-900">{order.trackingCode}</p>
                        </div>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Clock className="w-6 h-6 text-[#0284c7]" />
                        <div>
                          <p className="text-sm text-gray-500">Очікувана доставка</p>
                          <p className="font-semibold text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString('uk-UA')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Товари:</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-900">{item.product?.title || 'Товар'}</p>
                            <p className="text-sm text-gray-500">Кількість: {item.quantity} шт.</p>
                          </div>
                          <p className="font-bold text-gray-900">${(item.product?.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-gray-600">Разом:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-[#0284c7] to-[#0369a1] bg-clip-text text-transparent">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Потрібна допомога?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Якщо ви не можете знайти своє замовлення або маєте питання щодо доставки, зв'яжіться з нами
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+380441234567" className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <span className="text-lg">📞</span>
              <span className="font-semibold text-gray-900">+380 (44) 123-45-67</span>
            </a>
            <a href="mailto:support@webstore.com" className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <span className="text-lg">✉️</span>
              <span className="font-semibold text-gray-900">support@webstore.com</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderTrackingPage;

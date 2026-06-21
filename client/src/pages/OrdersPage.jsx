import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('Не вдалося завантажити замовлення');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="orders">
      <h1 className="orders-title">Мої замовлення</h1>
      
      {error && <ErrorMessage message={error} />}
      
      {orders.length === 0 ? (
        <div className="orders-empty">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p>Ви ще не оформили жодного замовлення</p>
          <Link to="/">До каталогу</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="orders-card">
              <div className="orders-header">
                <div className="orders-info">
                  <span className="orders-id">Замовлення #{order.id}</span>
                  <span className={`orders-status ${statusConfig[order.status]?.class || 'pending'}`}>
                    {statusConfig[order.status]?.label || order.status}
                  </span>
                </div>
                <span className="orders-date">
                  {new Date(order.createdAt).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="orders-items">
                {order.items.map((item) => (
                  <div key={item.id} className="orders-item">
                    <img src={item.product.image} alt={item.product.title} className="orders-item-image" />
                    <div className="orders-item-info">
                      <Link to={`/products/${item.productId}`}>{item.product.title}</Link>
                      <p>Кількість: {item.quantity} шт.</p>
                    </div>
                    <div className="orders-item-price">
                      <p className="total">${(item.product.price * item.quantity).toFixed(2)}</p>
                      <p className="unit">${item.product.price.toFixed(2)} / шт.</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="orders-footer">
                <span>Загальна сума:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

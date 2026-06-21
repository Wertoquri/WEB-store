import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { authAPI, ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CheckoutPage = () => {
  const { cart, fetchCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'card'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        zipCode: user.zipCode || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const items = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      await ordersAPI.create(items);
      clearCart();
      navigate('/orders', { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Не вдалося оформити замовлення');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="checkout">
      <h1 className="checkout-title">Оформлення замовлення</h1>

      <form onSubmit={handleSubmit}>
        <div className="checkout-grid">
          <div className="checkout-form">
            <h2 className="checkout-form-title">Інформація про доставку</h2>

            {error && <ErrorMessage message={error} />}

            <div className="checkout-form-section">
              <h3 className="checkout-form-section-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Контактні дані
              </h3>

              <div className="checkout-form-grid">
                <div className="checkout-form-group">
                  <label>Ім'я *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label>Прізвище *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="checkout-form-grid" style={{ marginTop: '1rem' }}>
                <div className="checkout-form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label>Телефон *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+380XXXXXXXXX"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="checkout-form-section">
              <h3 className="checkout-form-section-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Адреса доставки
              </h3>

              <div className="checkout-form-group full-width">
                <label>Вулиця, будинок, квартира *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="вул. Хрещатик, 1, кв. 10"
                  required
                />
              </div>

              <div className="checkout-form-grid" style={{ marginTop: '1rem' }}>
                <div className="checkout-form-group">
                  <label>Місто *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Київ"
                    required
                  />
                </div>
                <div className="checkout-form-group">
                  <label>Індекс *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="01001"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="checkout-form-section">
              <h3 className="checkout-form-section-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Спосіб оплати
              </h3>

              <div className="checkout-form-group full-width">
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  <option value="card">Банківська карта</option>
                  <option value="cash">Готівка при отриманні</option>
                  <option value="google">Google Pay</option>
                  <option value="apple">Apple Pay</option>
                </select>
              </div>
            </div>
          </div>

          <div className="checkout-summary">
            <h2 className="checkout-summary-title">Ваше замовлення</h2>

            <div className="checkout-items">
              {cart.items.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img src={item.product.image} alt={item.product.title} className="checkout-item-image" />
                  <div className="checkout-item-info">
                    <h4>{item.product.title}</h4>
                    <p>{item.product.category}</p>
                  </div>
                  <span className="checkout-item-qty">x{item.quantity}</span>
                  <span className="checkout-item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="checkout-total-row subtotal">
                <span>Підсумок:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="checkout-total-row shipping">
                <span>Доставка:</span>
                <span>Безкоштовно</span>
              </div>
            </div>

            <div className="checkout-total">
              <span>Разом:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button type="submit" disabled={loading} className="checkout-submit-btn">
              {loading ? (
                <span className="checkout-submit-btn-loading">
                  <svg className="checkout-spinner" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Обробка...
                </span>
              ) : (
                `Замовити на $${total.toFixed(2)}`
              )}
            </button>

            <Link to="/cart" className="checkout-back">← Повернутися до кошика</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

import { useState, useEffect } from 'react';
import { productsAPI, ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const statusConfig = {
  pending: { class: 'pending', label: 'Очікується' },
  processing: { class: 'processing', label: 'Обробляється' },
  shipped: { class: 'shipped', label: 'Відправлено' },
  delivered: { class: 'delivered', label: 'Доставлено' },
  cancelled: { class: 'cancelled', label: 'Скасовано' }
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [imageInputType, setImageInputType] = useState('url'); // 'url' or 'file'
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.products || response.data);
      setError('');
    } catch (err) {
      setError('Не вдалося завантажити товари');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await ordersAPI.getAllForAdmin();
      setOrders(response.data);
      setOrdersError('');
    } catch (err) {
      setOrdersError('Не вдалося завантажити замовлення');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      setOrdersError('Не вдалося оновити статус замовлення');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOpenForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        category: product.category || '',
        stock: product.stock.toString()
      });
      setImagePreviewUrl(product.image);
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: ''
      });
      setImagePreviewUrl('');
    }
    setSelectedImageFile(null);
    setImageInputType('url');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (imageInputType === 'file' && selectedImageFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('image', selectedImageFile);

        if (editingProduct) {
          await productsAPI.updateWithFile(editingProduct.id, formDataToSend);
        } else {
          await productsAPI.createWithFile(formDataToSend);
        }
      } else {
        // Use existing JSON-based method
        const submitData = { ...formData };
        if (imageInputType === 'url' && formData.image) {
          submitData.imageUrl = formData.image;
          delete submitData.image;
        }

        if (editingProduct) {
          await productsAPI.update(editingProduct.id, submitData);
        } else {
          await productsAPI.create(submitData);
        }
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Операція не вдалась');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Ви впевнені що хочете видалити цей товар?')) return;

    try {
      await productsAPI.delete(id);
      fetchProducts();
    } catch (err) {
      setError('Не вдалося видалити товар');
    }
  };

  if (loading && activeTab === 'products') {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Адмін панель</h1>
          <p>{activeTab === 'products' ? 'Управління товарами' : 'Управління замовленнями'}</p>
        </div>
        {activeTab === 'products' && (
          <button onClick={() => handleOpenForm()} className="admin-add-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Додати товар
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Товари
        </button>
        <button
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Замовлення
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          {error && <ErrorMessage message={error} />}

          {showForm && (
            <div className="admin-modal">
              <div className="admin-modal-content">
                <div className="admin-modal-header">
                  <h2>{editingProduct ? 'Редагувати товар' : 'Новий товар'}</h2>
                  <button onClick={() => setShowForm(false)}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="admin-modal-body">
                  <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-group">
                      <label>Назва *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Опис</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                      />
                    </div>

                    <div className="admin-form-group grid-2">
                      <div>
                        <label>Ціна ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label>Категорія</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="">Оберіть категорію</option>
                          <option value="Smartphones">Смартфони</option>
                          <option value="Laptops">Ноутбуки</option>
                          <option value="Audio">Аудіо</option>
                          <option value="Wearables">Годинники</option>
                          <option value="Tablets">Планшети</option>
                          <option value="Gaming">Ігри</option>
                          <option value="Cameras">Камери</option>
                          <option value="TVs">Телевізори</option>
                          <option value="Home">Дім</option>
                        </select>
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Залишок на складі</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Зображення</label>
                      
                      {/* Toggle between URL and File upload */}
                      <div className="admin-image-toggle">
                        <button
                          type="button"
                          className={imageInputType === 'url' ? 'active' : ''}
                          onClick={() => {
                            setImageInputType('url');
                            setSelectedImageFile(null);
                            setImagePreviewUrl(formData.image);
                          }}
                        >
                          URL посилання
                        </button>
                        <button
                          type="button"
                          className={imageInputType === 'file' ? 'active' : ''}
                          onClick={() => {
                            setImageInputType('file');
                            setImagePreviewUrl('');
                          }}
                        >
                          Завантажити файл
                        </button>
                      </div>

                      {imageInputType === 'url' ? (
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => {
                            setFormData({ ...formData, image: e.target.value });
                            setImagePreviewUrl(e.target.value);
                          }}
                          placeholder="https://example.com/image.jpg"
                        />
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setSelectedImageFile(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreviewUrl(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      )}
                      
                      {imagePreviewUrl && (
                        <img src={imagePreviewUrl} alt="Image Preview" className="admin-form-image-preview" />
                      )}
                    </div>

                    <div className="admin-form-actions">
                      <button type="submit" className="primary">
                        {editingProduct ? 'Оновити' : 'Створити'}
                      </button>
                      <button type="button" onClick={() => setShowForm(false)} className="secondary">
                        Скасувати
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Категорія</th>
                  <th>Ціна</th>
                  <th>Залишок</th>
                  <th>Рейтинг</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-table-product">
                        <img src={product.image} alt={product.title} className="admin-table-product-image" />
                        <span className="admin-table-product-name">{product.title}</span>
                      </div>
                    </td>
                    <td className="admin-table-category">{product.category || '-'}</td>
                    <td className="admin-table-price">${product.price.toFixed(2)}</td>
                    <td className={`admin-table-stock ${product.stock > 10 ? 'high' : product.stock > 0 ? 'low' : 'out'}`}>
                      {product.stock} шт.
                    </td>
                    <td className="admin-table-rating">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{product.rating} ({product.reviews})</span>
                    </td>
                    <td className="admin-table-actions">
                      <button onClick={() => handleOpenForm(product)}>Редагувати</button>
                      <button onClick={() => handleDelete(product.id)}>Видалити</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="admin-orders">
          {ordersError && <ErrorMessage message={ordersError} />}

          {ordersLoading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>Замовлень ще немає</p>
            </div>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Користувач</th>
                    <th>Сума</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.user?.email || '-'}</td>
                      <td className="admin-table-price">${order.total.toFixed(2)}</td>
                      <td>
                        <select
                          className={`orders-status ${statusConfig[order.status]?.class || 'pending'}`}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingStatus}
                        >
                          {Object.entries(statusConfig).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="admin-table-actions">
                        <button onClick={() => setSelectedOrder(order)}>Деталі</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="admin-modal" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Замовлення #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="order-details-info">
                <div className="order-details-row">
                  <span className="order-details-label">Користувач:</span>
                  <span>{selectedOrder.user?.email || '-'}</span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">Статус:</span>
                  <span className={`orders-status ${statusConfig[selectedOrder.status]?.class || 'pending'}`}>
                    {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                  </span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">Дата:</span>
                  <span>
                    {new Date(selectedOrder.createdAt).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="order-details-row">
                  <span className="order-details-label">Загальна сума:</span>
                  <span className="order-details-total">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <h3 className="order-details-title">Товари:</h3>
              <div className="order-details-items">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="orders-item">
                    <img src={item.product.image} alt={item.product.title} className="orders-item-image" />
                    <div className="orders-item-info">
                      <p className="order-item-name">{item.product.title}</p>
                      <p>Кількість: {item.quantity} шт.</p>
                    </div>
                    <div className="orders-item-price">
                      <p className="total">${(item.product.price * item.quantity).toFixed(2)}</p>
                      <p className="unit">${item.product.price.toFixed(2)} / шт.</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-details-actions">
                <label>Змінити статус:</label>
                <select
                  className={`orders-status ${statusConfig[selectedOrder.status]?.class || 'pending'}`}
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  disabled={updatingStatus}
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

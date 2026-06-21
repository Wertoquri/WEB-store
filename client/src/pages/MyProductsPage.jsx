import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { productsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const initialFormState = {
  title: '',
  description: '',
  price: '',
  image: '',
  category: '',
  stock: ''
};

const MyProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imageInputType, setImageInputType] = useState('url');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getMine();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Не вдалося завантажити ваші товари');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setImageInputType('url');
    setSelectedImageFile(null);
    setImagePreviewUrl('');
  };

  const handleOpenForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description || '',
        price: product.price?.toString() || '',
        image: product.image || '',
        category: product.category || '',
        stock: product.stock?.toString() || '0'
      });
      setImagePreviewUrl(product.image || '');
    } else {
      resetForm();
    }

    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
    setSearchParams({});
  };

  useEffect(() => {
    if (searchParams.get('create') === '1' && !showForm) {
      handleOpenForm();
    }
  }, [searchParams, showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);

      if (imageInputType === 'file' && selectedImageFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('stock', formData.stock || '0');
        formDataToSend.append('image', selectedImageFile);

        if (editingProduct) {
          await productsAPI.updateWithFile(editingProduct.id, formDataToSend);
        } else {
          await productsAPI.createWithFile(formDataToSend);
        }
      } else {
        const payload = {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          stock: formData.stock || '0',
          image: formData.image
        };

        if (editingProduct) {
          await productsAPI.update(editingProduct.id, payload);
        } else {
          await productsAPI.create(payload);
        }
      }

      toast.success(editingProduct ? 'Товар оновлено' : 'Товар створено');
      handleCloseForm();
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Не вдалося зберегти товар');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Видалити цей товар?')) {
      return;
    }

    try {
      await productsAPI.delete(productId);
      toast.success('Товар видалено');
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Не вдалося видалити товар');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Мої товари</h1>
          <p>Створюйте власні товари та керуйте ними як власник продукту.</p>
        </div>
        <button onClick={() => handleOpenForm()} className="admin-add-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Створити товар
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <div className="admin-modal" onClick={handleCloseForm}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingProduct ? 'Редагувати товар' : 'Новий товар'}</h2>
              <button onClick={handleCloseForm}>
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
                    rows="4"
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
                    <label>Залишок</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
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

                <div className="admin-form-group">
                  <label>Зображення</label>

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
                      URL
                    </button>
                    <button
                      type="button"
                      className={imageInputType === 'file' ? 'active' : ''}
                      onClick={() => {
                        setImageInputType('file');
                        setImagePreviewUrl('');
                      }}
                    >
                      Файл
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
                        const file = e.target.files?.[0];
                        setSelectedImageFile(file || null);

                        if (!file) {
                          setImagePreviewUrl('');
                          return;
                        }

                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreviewUrl(reader.result);
                        reader.readAsDataURL(file);
                      }}
                    />
                  )}

                  {imagePreviewUrl && (
                    <img src={imagePreviewUrl} alt="Preview" className="admin-form-image-preview" />
                  )}
                </div>

                <div className="admin-form-actions">
                  <button type="submit" className="primary" disabled={submitting}>
                    {submitting ? 'Зберігаємо...' : editingProduct ? 'Оновити' : 'Створити'}
                  </button>
                  <button type="button" onClick={handleCloseForm} className="secondary">
                    Скасувати
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="orders-empty">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <p>У вас ще немає власних товарів.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default MyProductsPage;

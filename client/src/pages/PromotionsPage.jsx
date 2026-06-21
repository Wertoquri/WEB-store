import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Gift, Percent, Truck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsAPI } from '../services/api';

const promotions = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Весняний розпродаж',
    discount: '-50%',
    description: 'Знижки до 50% на популярну техніку для дому, роботи та відпочинку.',
    gradient: 'from-red-500 to-orange-500',
    endDate: '30 травня 2026',
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'Безкоштовна доставка',
    discount: '0 грн',
    description: 'Доставляємо безкоштовно замовлення від 1000 грн по всій Україні.',
    gradient: 'from-blue-500 to-blue-600',
    endDate: 'Постійна пропозиція',
  },
  {
    icon: <Gift className="h-8 w-8" />,
    title: 'Подарунок до замовлення',
    discount: 'Подарунок',
    description: 'До замовлень від 5000 грн додаємо корисний аксесуар без доплати.',
    gradient: 'from-purple-500 to-purple-600',
    endDate: 'До кінця місяця',
  },
];

const PromotionsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = async (productId, e) => {
    e?.preventDefault();

    if (!isAuthenticated) {
      toast.error('Увійдіть, щоб додати товар у кошик');
      navigate('/login');
      return;
    }

    try {
      await addToCart(productId);
      toast.success('Товар додано до кошика');
    } catch (error) {
      if (error.code === 'AUTH_REQUIRED') {
        toast.error('Сесія завершилась. Увійдіть ще раз');
        navigate('/login');
        return;
      }

      toast.error('Не вдалося додати товар у кошик');
    }
  };

  const handleToggleWishlist = async (product, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
      toast.info('Товар видалено з обраного');
      return;
    }

    await addToWishlist(product);
    toast.success('Товар додано до обраного');
  };

  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        const response = await productsAPI.getAll({ limit: 100 });
        const promoProducts = (response.data.products || [])
          .filter((product) => product.stock < 30 && product.stock > 0)
          .slice(0, 8);
        setProducts(promoProducts);
      } catch (error) {
        console.error('Failed to fetch promo products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-4 flex items-center gap-3">
            <Percent className="h-10 w-10" />
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Акції та вигідні пропозиції</h1>
          </div>
          <p className="max-w-2xl text-xl text-white/90">
            Тут зібрані актуальні знижки, подарунки до замовлень і товари, які зараз можна купити на особливо хороших умовах.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Поточні акції</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {promotions.map((promo, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.gradient} p-6 text-white shadow-lg`}
              >
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
                <div className="relative z-10">
                  <div className="mb-3 flex items-center gap-3">
                    {promo.icon}
                    <span className="text-3xl font-bold">{promo.discount}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{promo.title}</h3>
                  <p className="mb-4 text-white/90">{promo.description}</p>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Clock className="h-4 w-4" />
                    <span>Діє до: {promo.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-red-50 to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Zap className="h-6 w-6 text-orange-500" />
                Товари зі знижками
              </h2>
              <p className="mt-1 text-gray-500">Добірка моделей, на які зараз діє краща ціна.</p>
            </div>
            <Link to="/" className="flex items-center gap-1 font-medium text-[#0284c7] hover:underline">
              Перейти в каталог <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl bg-white py-12 text-center">
              <Zap className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">Зараз немає активних знижок у цій добірці</h3>
              <p className="mb-6 text-gray-500">Зайдіть трохи пізніше, ми регулярно оновлюємо акційні пропозиції.</p>
              <Link
                to="/"
                className="rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0369a1] px-8 py-3 font-medium text-white transition-all hover:shadow-xl"
              >
                До каталогу
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PromotionsPage;

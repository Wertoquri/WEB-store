import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const pageShellClass = 'mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8';
const surfaceClass = 'rounded-lg border border-white/55 bg-white/72 shadow-[var(--shadow-soft)] backdrop-blur-xl';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, loading, fetchWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchWishlist().catch(() => {});
  }, [fetchWishlist]);

  const handleAddToCart = async (productId, event) => {
    event?.preventDefault();

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
        toast.error('Сесія завершилась. Увійдіть знову');
        navigate('/login');
        return;
      }

      toast.error('Не вдалося додати товар у кошик');
    }
  };

  const handleToggleWishlist = async (product, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    await removeFromWishlist(product.id);
    toast.info('Товар видалено з улюблених');
  };

  if (loading && wishlist.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="store-page min-h-screen pb-24">
      <section className="border-b border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0)_100%)]">
        <div className={pageShellClass}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                Обране
              </p>
              <div className="mt-5 flex items-center gap-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-white shadow-[0_20px_34px_-24px_rgba(255,107,74,0.75)]">
                  <Heart className="h-7 w-7 fill-current" />
                </div>
                <div>
                  <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)] sm:text-5xl">
                    Улюблені товари
                  </h1>
                  <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
                    {wishlist.length > 0
                      ? `Збережено ${wishlist.length} товарів для швидкого повернення до покупки.`
                      : 'Тут зберігаються товари, які ви відмітили сердечком.'}
                  </p>
                </div>
              </div>
            </div>

            <div className={cn(surfaceClass, 'px-5 py-4')}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                Товарів в обраному
              </p>
              <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                {wishlist.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={pageShellClass}>
        {wishlist.length === 0 ? (
          <div className={cn(surfaceClass, 'mx-auto max-w-3xl px-8 py-14 text-center')}>
            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full border border-[var(--line-soft)] bg-[var(--brand-soft)] text-[var(--brand)]">
              <Heart className="h-10 w-10" />
            </div>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
              У списку поки порожньо
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
              Додавайте товари через сердечко на картці або на сторінці товару, і вони з’являться тут.
            </p>
            <Link
              to="/catalog"
              className={cn(
                'mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white',
                'bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] shadow-[0_18px_36px_-24px_rgba(255,107,74,0.8)]',
                'transition hover:translate-y-[-1px]'
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default WishlistPage;

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { formatCurrency, parseProductColors, parseProductImages } from '../lib/storefront';

const pageTransition = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, fetchCart, removeFromCart, updateCartItem, total } = useCart();
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart().catch(() => {
      setError('Не вдалося завантажити кошик.');
    });
  }, []);

  const handleCheckout = () => {
    if (!cart?.items?.length) {
      setError('Ваш кошик порожній.');
      return;
    }

    navigate('/checkout');
  };

  const handleQuantityChange = async (productId, nextQuantity) => {
    if (nextQuantity < 1) {
      return;
    }

    try {
      await updateCartItem(productId, nextQuantity);
    } catch (requestError) {
      setError('Не вдалося оновити кількість товару.');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (requestError) {
      setError('Не вдалося видалити товар із кошика.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <motion.div
      className="store-page pb-32"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <section className="border-b border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.64)_0%,rgba(255,255,255,0)_100%)]">
        <div className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">Крок оформлення 01</p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.06em] text-[var(--ink-strong)]">
            Перевірте товари перед оформленням замовлення.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
            Тут зібрані вибрані товари, кількість, ціна та підсумок замовлення, щоб ви могли швидко все перевірити перед оплатою.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
        {error ? <ErrorMessage message={error} /> : null}

        {!cart || cart.items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--line-soft)] bg-white/70 px-6 py-16 text-center shadow-[var(--shadow-soft)]">
            <ShoppingBag className="mx-auto h-12 w-12 text-[var(--ink-muted)]" />
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
              Ваш кошик поки порожній.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
              Каталог і швидке додавання вже підготовлені так, щоб повернення до покупки зайняло кілька секунд.
            </p>
            <Link
              to="/catalog"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white"
            >
              Перейти в каталог
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),360px]">
            <div className="space-y-4">
              {cart.items.map((item) => {
                const image = parseProductImages(item.product)[0] || item.product.image;
                const productColors = parseProductColors(item.product);
                const colorMeta = productColors.find((color) => color.name === item.color);

                return (
                  <div
                    key={item.id}
                    className="grid gap-4 rounded-lg border border-white/55 bg-white/72 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:grid-cols-[160px,1fr]"
                  >
                    <img src={image} alt={item.product.title} className="aspect-[4/3] w-full rounded-lg object-cover" />

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <Link
                            to={`/products/${item.productId}`}
                            className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)] transition hover:text-[var(--brand)]"
                          >
                            {item.product.title}
                          </Link>
                          <p className="mt-2 text-sm text-[var(--ink-soft)]">Категорія: {item.product.category}</p>
                          {item.color ? (
                            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--sand)] px-3 py-1 text-xs font-medium text-[var(--ink-soft)]">
                              {colorMeta ? (
                                <span
                                  className="h-3 w-3 rounded-full border border-black/10"
                                  style={{ backgroundColor: colorMeta.hex }}
                                />
                              ) : null}
                              Колір: {item.color}
                            </div>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.productId)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600"
                          aria-label="Видалити товар"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="inline-flex h-12 items-center rounded-full border border-[var(--line-soft)] bg-white px-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-lg text-[var(--ink-strong)]"
                          >
                            -
                          </button>
                          <span className="min-w-[2rem] text-center font-semibold text-[var(--ink-strong)]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-lg text-[var(--ink-strong)] disabled:opacity-35"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Разом за позицію</p>
                          <p className="mt-1 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                          <p className="text-sm text-[var(--ink-soft)]">{formatCurrency(item.product.price)} / шт.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-lg border border-white/60 bg-white/78 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">Підсумок замовлення</p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
                  Підсумок
                </h2>

                <div className="mt-6 space-y-3 text-sm text-[var(--ink-soft)]">
                  <div className="flex items-center justify-between rounded-lg border border-[var(--line-soft)] bg-white/70 px-4 py-3">
                    <span>Товарів</span>
                    <span className="font-medium text-[var(--ink-strong)]">{itemCount} шт.</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-[var(--line-soft)] bg-white/70 px-4 py-3">
                    <span>Доставка</span>
                    <span className="font-medium text-emerald-600">Безкоштовно</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-[var(--line-soft)] bg-[var(--sand)]/65 px-4 py-4">
                    <span className="text-[var(--ink-strong)]">До оплати</span>
                    <span className="font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(255,107,74,0.75)]"
                >
                  Оформити замовлення
                  <ArrowRight className="h-4 w-4" />
                </button>

                <Link
                  to="/catalog"
                  className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-[var(--line-soft)] bg-white text-sm font-semibold text-[var(--ink-strong)]"
                >
                  Продовжити покупки
                </Link>

                <div className="mt-6 grid gap-3 border-t border-[var(--line-soft)] pt-5 text-sm text-[var(--ink-soft)]">
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-[var(--brand)]" />
                    Відправка протягом 24 годин
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-[var(--brand)]" />
                    Офіційна гарантія на весь каталог
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>

      {cart?.items?.length ? (
        <div className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4 rounded-full border border-white/45 bg-[rgba(18,24,38,0.92)] px-5 py-3 text-white shadow-[0_28px_60px_-34px_rgba(19,28,45,0.9)] backdrop-blur-2xl">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">До оплати</div>
              <div className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em]">{formatCurrency(total)}</div>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-5 text-sm font-semibold text-white"
            >
              До оформлення
            </button>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

export default CartPage;

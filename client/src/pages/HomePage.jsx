import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, ShieldCheck, Sparkles, Star, Truck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';
import StoreSectionHeading from '../components/storefront/StoreSectionHeading';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { categoryDefinitions, buildCatalogPath, formatCompactNumber, parseProductImages } from '../lib/storefront';
import { productsAPI } from '../services/api';

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll({ limit: 24, sort: 'newest' });

        if (!isMounted) {
          return;
        }

        setProducts(response.data.products || []);
        setError('');
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError('Не вдалося завантажити головну вітрину.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = async (productId, event) => {
    event?.preventDefault();

    if (!isAuthenticated) {
      toast.error('Увійдіть у профіль, щоб додати товар у кошик.');
      navigate('/login');
      return;
    }

    try {
      await addToCart(productId);
      toast.success('Товар додано в кошик.');
    } catch (requestError) {
      toast.error('Не вдалося додати товар у кошик.');
    }
  };

  const handleToggleWishlist = (product, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return;
    }

    addToWishlist(product);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const spotlightProduct = products[0];
  const heroProducts = products.slice(0, 3);
  const featuredProducts = products.slice(1, 4);
  const quickPicks = products.slice(0, 4);
  const editorChoice = products.slice(4, 8);

  return (
    <div className="store-page pb-24">
      <section className="border-b border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_100%)]">
        <div className="mx-auto grid w-full max-w-[1380px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr,0.9fr] lg:px-8 lg:py-16">
          <motion.div variants={reveal} initial="hidden" animate="visible" className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5" />
              Техніка для щоденних покупок
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold tracking-[-0.06em] text-[var(--ink-strong)] sm:text-6xl lg:text-7xl">
              Все необхідне для дому, роботи та відпочинку в одному магазині.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">
              Обирайте смартфони, ноутбуки, аудіо, техніку для дому та інші товари з швидким пошуком, зрозумілими цінами
              й зручною навігацією по категоріях.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white shadow-[0_20px_44px_-24px_rgba(255,107,74,0.8)] transition hover:translate-y-[-1px]"
              >
                Відкрити каталог
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/promotions"
                className="inline-flex h-14 items-center gap-3 rounded-full border border-[var(--line-soft)] bg-white/75 px-6 text-sm font-semibold text-[var(--ink-strong)] shadow-[var(--shadow-soft)] backdrop-blur-xl transition hover:border-[var(--brand-soft)]"
              >
                Акції та новинки
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/55 bg-white/68 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">Товарів у каталозі</div>
                <div className="mt-3 font-display text-3xl font-semibold text-[var(--ink-strong)]">
                  {formatCompactNumber(products.length)}
                </div>
              </div>
              <div className="rounded-lg border border-white/55 bg-white/68 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">Оформлення</div>
                <div className="mt-3 font-display text-3xl font-semibold text-[var(--ink-strong)]">3 кроки</div>
              </div>
              <div className="rounded-lg border border-white/55 bg-white/68 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                  Швидке додавання
                </div>
                <div className="mt-3 font-display text-3xl font-semibold text-[var(--ink-strong)]">Активно</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-2 sm:grid-rows-2">
            {heroProducts.map((product, index) => {
              const image = parseProductImages(product)[0] || product.image;
              const isPrimary = index === 0;

              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className={`group relative overflow-hidden rounded-lg border border-white/55 bg-white/55 shadow-[var(--shadow-soft)] backdrop-blur-xl ${
                    isPrimary ? 'sm:row-span-2 min-h-[420px]' : 'min-h-[204px]'
                  }`}
                >
                  {image ? <img src={image} alt={product.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,24,0)_20%,rgba(12,16,24,0.78)_100%)]" />
                  <div className="relative flex h-full flex-col justify-end p-5 text-white">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/68">
                      {isPrimary ? 'Хіт тижня' : 'Нова позиція'}
                    </p>
                    <h2 className={`mt-2 font-display tracking-[-0.04em] ${isPrimary ? 'text-3xl' : 'text-2xl'}`}>
                      {product.title}
                    </h2>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
                        <Star className="h-4 w-4 fill-current" />
                        {product.rating || 4.8}
                      </span>
                      <span className="font-semibold">${product.price}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {categoryDefinitions.map((category) => (
            <Link
              key={category.id}
              to={buildCatalogPath({ categoryId: category.id })}
              className="inline-flex min-w-max snap-start items-center gap-3 rounded-full border border-white/45 bg-white/60 px-5 py-3 text-sm font-medium text-[var(--ink-strong)] shadow-[var(--shadow-soft)] backdrop-blur-xl transition hover:border-[var(--brand-soft)] hover:bg-white"
            >
              <category.icon className="h-4 w-4 text-[var(--brand)]" />
              {category.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
        <StoreSectionHeading
          eyebrow="Популярні товари"
          title="Добірка моделей, які зараз найчастіше переглядають і купують."
          description="Тут зібрані товари, на які найчастіше звертають увагу покупці: від флагманських пристроїв до практичних щоденних рішень."
        />

        {spotlightProduct ? (
          <div className="grid gap-5 lg:grid-cols-[1.15fr,0.85fr]">
            <Link
              to={`/products/${spotlightProduct.id}`}
              className="group relative overflow-hidden rounded-lg border border-white/55 bg-white/55 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            >
              <img
                src={parseProductImages(spotlightProduct)[0] || spotlightProduct.image}
                alt={spotlightProduct.title}
                className="aspect-[16/12] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,24,0.02)_15%,rgba(12,16,24,0.8)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur-md">
                  Головна рекомендація
                </p>
                <h3 className="mt-4 max-w-xl font-display text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                  {spotlightProduct.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">
                  Перейдіть на сторінку товару, щоб переглянути характеристики, відгуки, доступні кольори та оформити покупку.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  Перейти до товару
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            <div className="grid gap-5">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group grid gap-4 rounded-lg border border-white/55 bg-white/65 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:grid-cols-[160px,1fr]"
                >
                  <img
                    src={parseProductImages(product)[0] || product.image}
                    alt={product.title}
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                        Рекомендуємо
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                        {product.title}
                      </h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-[var(--ink-soft)]">
                      <span>Рейтинг {product.rating || 4.8}</span>
                      <span className="font-semibold text-[var(--ink-strong)]">${product.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
        <StoreSectionHeading
          eyebrow="Швидке додавання"
          title="Ключові товари доступні до кошика прямо з вітрини."
          description="Кнопка купівлі, ціна та наявність одразу перед очима, тому потрібний товар можна швидко додати до кошика."
        />

        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">{error}</div> : null}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {quickPicks.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
        <StoreSectionHeading
          eyebrow="Переваги магазину"
          title="Ми зробили покупку простою, зрозумілою та зручною на кожному етапі."
          description="Зручний каталог, швидке додавання в кошик, зрозумілі умови доставки та гарантії допомагають швидше оформити замовлення."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: Truck,
              title: 'Швидке оформлення',
              description: 'Ключові дії доступні одразу, тому від вибору товару до оформлення замовлення потрібно менше часу.',
            },
            {
              icon: ShieldCheck,
              title: 'Зрозуміла інформація',
              description: 'На картках товарів одразу видно ціну, рейтинг, наявність і головні умови покупки без зайвого перевантаження.',
            },
            {
              icon: Compass,
              title: 'Зручна навігація',
              description: 'Категорії, пошук і сторінки товарів побудовані так, щоб легко знайти потрібну модель і перейти до покупки.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-white/55 bg-white/68 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
              <item.icon className="h-5 w-5 text-[var(--brand)]" />
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-4">
          {editorChoice.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <ProductCard product={product} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/30 bg-[linear-gradient(135deg,rgba(20,28,42,0.95)_0%,rgba(17,26,39,0.92)_100%)]">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6 px-4 py-12 text-white sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">Покупка без зайвих кроків</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em]">
              Від головної сторінки до оформлення замовлення все побудовано так, щоб покупець швидко знаходив потрібний товар.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/catalog"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white"
            >
              Перейти до каталогу
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={buildCatalogPath({ search: 'Apple' })}
              className="inline-flex h-14 items-center gap-3 rounded-full border border-white/20 bg-white/8 px-6 text-sm font-semibold text-white backdrop-blur-md"
            >
              Спробувати пошук
              <Zap className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

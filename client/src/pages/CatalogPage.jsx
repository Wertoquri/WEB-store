import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Filter, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import CatalogFilters from '../components/storefront/CatalogFilters';
import StoreSectionHeading from '../components/storefront/StoreSectionHeading';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { cn } from '../components/ui/utils';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsAPI } from '../services/api';
import {
  ALL_CATEGORY,
  PRODUCTS_PER_PAGE,
  buildCatalogPath,
  categoryDefinitions,
  clampPage,
  formatCompactNumber,
  resolveDbCategory,
  resolveCategoryLabel,
} from '../lib/storefront';

const pageTransition = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const buildCatalogSearch = ({ category, search, priceMin, priceMax, sortBy, page }) => {
  const params = new URLSearchParams();

  if (category !== ALL_CATEGORY) {
    params.set('category', category);
  }

  if (search.trim()) {
    params.set('search', search.trim());
  }

  if (priceMin !== '') {
    params.set('min', priceMin);
  }

  if (priceMax !== '') {
    params.set('max', priceMax);
  }

  if (sortBy !== 'newest') {
    params.set('sort', sortBy);
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  return params.toString() ? `?${params.toString()}` : '';
};

const getStateFromSearch = (search) => {
  const params = new URLSearchParams(search);
  const category = params.get('category');
  const sort = params.get('sort');
  const page = Number(params.get('page'));

  return {
    category: categoryDefinitions.some((item) => item.id === category) ? category : ALL_CATEGORY,
    search: params.get('search') || '',
    priceMin: params.get('min') || '',
    priceMax: params.get('max') || '',
    sortBy: ['newest', 'price_asc', 'price_desc', 'rating', 'name_asc'].includes(sort) ? sort : 'newest',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
};

const CatalogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = getStateFromSearch(location.search);

  const [selectedCategory, setSelectedCategory] = useState(initialState.category);
  const [searchQuery, setSearchQuery] = useState(initialState.search);
  const [debouncedSearch, setDebouncedSearch] = useState(initialState.search);
  const [priceMin, setPriceMin] = useState(initialState.priceMin);
  const [priceMax, setPriceMax] = useState(initialState.priceMax);
  const [sortBy, setSortBy] = useState(initialState.sortBy);
  const [currentPage, setCurrentPage] = useState(initialState.page);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!isFilterOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterOpen]);

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const safeCurrentPage = clampPage(currentPage, totalPages);

  const syncCatalogLocation = (pageValue) => {
    const nextSearch = buildCatalogSearch({
      category: selectedCategory,
      search: debouncedSearch,
      priceMin,
      priceMax,
      sortBy,
      page: pageValue,
    });

    navigate(
      {
        pathname: '/catalog',
        search: nextSearch,
      },
      { replace: true }
    );
  };

  const handlePageChange = (pageValue) => {
    const nextPage = clampPage(pageValue, totalPages);

    if (nextPage === safeCurrentPage) {
      return;
    }

    setCurrentPage(nextPage);
    syncCatalogLocation(nextPage);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 180);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const next = getStateFromSearch(location.search);
    setSelectedCategory((current) => (current === next.category ? current : next.category));
    setSearchQuery((current) => (current === next.search ? current : next.search));
    setDebouncedSearch((current) => (current === next.search ? current : next.search));
    setPriceMin((current) => (current === next.priceMin ? current : next.priceMin));
    setPriceMax((current) => (current === next.priceMax ? current : next.priceMax));
    setSortBy((current) => (current === next.sortBy ? current : next.sortBy));
    setCurrentPage((current) => (current === next.page ? current : next.page));
  }, [location.search]);

  useEffect(() => {
    const nextSearch = buildCatalogSearch({
      category: selectedCategory,
      search: debouncedSearch,
      priceMin,
      priceMax,
      sortBy,
      page: currentPage,
    });

    if (nextSearch !== location.search) {
      navigate({ pathname: '/catalog', search: nextSearch }, { replace: true });
    }
  }, [currentPage, debouncedSearch, location.search, navigate, priceMax, priceMin, selectedCategory, sortBy]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          limit: 120,
          sort: sortBy,
        };

        if (selectedCategory !== ALL_CATEGORY) {
          params.category = resolveDbCategory(selectedCategory);
        }

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        const response = await productsAPI.getAll(params);
        let nextProducts = response.data.products || [];

        if (priceMin !== '') {
          nextProducts = nextProducts.filter((product) => product.price >= Number(priceMin));
        }

        if (priceMax !== '') {
          nextProducts = nextProducts.filter((product) => product.price <= Number(priceMax));
        }

        if (!isMounted) {
          return;
        }

        const nextTotal = nextProducts.length;
        const nextTotalPages = Math.max(1, Math.ceil(nextTotal / PRODUCTS_PER_PAGE));
        const safePage = clampPage(currentPage, nextTotalPages);

        setProducts(nextProducts);
        setTotalProducts(nextTotal);
        setError('');

        if (safePage !== currentPage) {
          setCurrentPage(safePage);
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError('Не вдалося завантажити каталог. Спробуйте оновити сторінку.');
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
  }, [currentPage, debouncedSearch, priceMax, priceMin, selectedCategory, sortBy]);

  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedCategory(ALL_CATEGORY);
    setSearchQuery('');
    setDebouncedSearch('');
    setPriceMin('');
    setPriceMax('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId, event) => {
    event?.preventDefault();

    if (!isAuthenticated) {
      toast.error('Спершу увійдіть у профіль, щоб додати товар у кошик.');
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

  return (
    <motion.div
      className="store-page relative overflow-hidden pb-24"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <section className="border-b border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0)_100%)]">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)] backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5" />
                Каталог товарів
              </p>
              <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)] md:text-6xl">
                Каталог, у якому легко приймати рішення.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
                Шукайте товари за категоріями, ціною та рейтингом, порівнюйте моделі й одразу переходьте до покупки без
                зайвих кроків.
              </p>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border border-white/50 bg-white/68 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">Товарів</div>
                <div className="mt-3 font-display text-3xl font-semibold text-[var(--ink-strong)]">
                  {formatCompactNumber(totalProducts || products.length)}
                </div>
              </div>
              <div className="rounded-lg border border-white/50 bg-white/68 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">Фільтрів</div>
                <div className="mt-3 font-display text-3xl font-semibold text-[var(--ink-strong)]">4</div>
              </div>
              <div className="rounded-lg border border-white/50 bg-white/68 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">Швидка покупка</div>
                <div className="mt-3 font-display text-3xl font-semibold text-[var(--ink-strong)]">В 1 клік</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line-soft)] bg-white/75 px-5 text-sm font-semibold text-[var(--ink-strong)] shadow-[var(--shadow-soft)] backdrop-blur-xl transition hover:border-[var(--brand-soft)]"
            >
              На головну
            </Link>
            {categoryDefinitions.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  'inline-flex h-12 items-center gap-2 rounded-full border px-4 text-sm transition',
                  selectedCategory === category.id
                    ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--ink-strong)]'
                    : 'border-white/45 bg-white/55 text-[var(--ink-soft)] hover:border-[var(--brand-soft)] hover:bg-white/75'
                )}
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line-soft)] bg-white/78 px-5 text-sm font-semibold text-[var(--ink-strong)] shadow-[var(--shadow-soft)] backdrop-blur-xl"
          >
            <Filter className="h-4 w-4" />
            Фільтри
          </button>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-12 rounded-full border border-[var(--line-soft)] bg-white/78 px-5 text-sm text-[var(--ink-strong)] shadow-[var(--shadow-soft)] outline-none backdrop-blur-xl"
          >
            <option value="newest">Новинки</option>
            <option value="price_asc">Ціна зростає</option>
            <option value="price_desc">Ціна спадає</option>
            <option value="rating">Рейтинг</option>
            <option value="name_asc">Назва</option>
          </select>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px,minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-lg border border-white/60 bg-white/72 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
              <CatalogFilters
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceMin={priceMin}
                onPriceMinChange={setPriceMin}
                priceMax={priceMax}
                onPriceMaxChange={setPriceMax}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalProducts={totalProducts}
                onReset={handleReset}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <StoreSectionHeading
              eyebrow={selectedCategory === ALL_CATEGORY ? 'Усі категорії' : resolveCategoryLabel(selectedCategory)}
              title={
                selectedCategory === ALL_CATEGORY
                  ? 'Оберіть потрібний товар у кілька кроків.'
                  : `${resolveCategoryLabel(selectedCategory)}: актуальні моделі та зручний вибір.`
              }
              description="На картках товарів одразу видно ціну, наявність, рейтинг і кнопку додавання в кошик, а фільтри допомагають швидко звузити вибір."
            />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/55 bg-white/65 px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur-xl">
              <p className="text-sm text-[var(--ink-soft)]">
                Показано <span className="font-semibold text-[var(--ink-strong)]">{visibleProducts.length}</span> із{' '}
                <span className="font-semibold text-[var(--ink-strong)]">{totalProducts}</span> товарів
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {debouncedSearch.trim() ? (
                  <span className="inline-flex h-10 items-center rounded-full bg-[var(--sand)] px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                    Пошук: {debouncedSearch}
                  </span>
                ) : null}
                {selectedCategory !== ALL_CATEGORY ? (
                  <span className="inline-flex h-10 items-center rounded-full bg-[var(--brand-soft)] px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-strong)]">
                    {resolveCategoryLabel(selectedCategory)}
                  </span>
                ) : null}
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">{error}</div>
            ) : null}

            {!error && visibleProducts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[var(--line-soft)] bg-white/55 px-6 py-16 text-center shadow-[var(--shadow-soft)]">
                <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                  За цими параметрами товарів не знайдено.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
                  Спробуйте зняти частину фільтрів або повернутися до повного каталогу. Ми зберегли логіку так, щоб
                  ви не втрачали контекст під час пошуку.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white"
                >
                  Скинути фільтри
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            {!error && visibleProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.35 }}
                  >
                    <ProductCard product={product} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />
                  </motion.div>
                ))}
              </div>
            ) : null}

            {totalPages > 1 ? (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className={cn(
                    'inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line-soft)]',
                    'bg-white/78 px-5 text-sm font-semibold text-[var(--ink-strong)]',
                    'shadow-[var(--shadow-soft)] disabled:cursor-not-allowed disabled:opacity-40'
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Назад
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((page) => page === 1 || page === totalPages || Math.abs(page - safeCurrentPage) <= 1)
                  .map((page, index, pages) => {
                    const previous = pages[index - 1];
                    const hasGap = previous && page - previous > 1;

                    return (
                      <div key={page} className="flex items-center gap-3">
                        {hasGap ? <span className="text-[var(--ink-muted)]">...</span> : null}
                        <button
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={cn(
                            'inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition',
                            page === safeCurrentPage
                              ? 'bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-white shadow-[0_18px_32px_-22px_rgba(255,107,74,0.8)]'
                              : 'border border-[var(--line-soft)] bg-white/78 text-[var(--ink-strong)] shadow-[var(--shadow-soft)]'
                          )}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}

                <button
                  type="button"
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  className={cn(
                    'inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line-soft)]',
                    'bg-white/78 px-5 text-sm font-semibold text-[var(--ink-strong)]',
                    'shadow-[var(--shadow-soft)] disabled:cursor-not-allowed disabled:opacity-40'
                  )}
                >
                  Далі
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isFilterOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/45 px-3 py-3 sm:px-4 sm:py-6 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              className="mx-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overscroll-contain overflow-x-hidden overflow-y-auto rounded-lg border border-white/30 bg-[var(--surface-elevated)] p-4 shadow-[0_32px_60px_-36px_rgba(19,28,45,0.8)] sm:max-h-[calc(100dvh-3rem)] sm:p-5"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                    Мобільні фільтри
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">
                    Швидке уточнення вибору
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white"
                  aria-label="Закрити фільтри"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <CatalogFilters
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceMin={priceMin}
                onPriceMinChange={setPriceMin}
                priceMax={priceMax}
                onPriceMaxChange={setPriceMax}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalProducts={totalProducts}
                onReset={handleReset}
                compact
              />

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-sm font-semibold text-white"
              >
                Показати {visibleProducts.length} товарів
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default CatalogPage;

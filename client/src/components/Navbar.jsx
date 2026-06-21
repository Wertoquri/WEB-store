import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, Menu, Search, ShoppingBag, Sparkles, User, X } from 'lucide-react';
import DashboardModal from './DashboardModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { buildCatalogPath, categoryDefinitions } from '../lib/storefront';

const navLinks = [
  { to: '/', label: 'Головна' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/promotions', label: 'Акції' },
];

const linkClasses = ({ isActive }) =>
  `inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition ${
    isActive
      ? 'bg-[var(--ink-strong)] text-white shadow-[var(--shadow-soft)]'
      : 'text-[var(--ink-soft)] hover:bg-white hover:text-[var(--ink-strong)]'
  }`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }

    return user?.email?.[0]?.toUpperCase() || '?';
  };

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(buildCatalogPath({ search: searchQuery }));
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(buildCatalogPath({ categoryId }));
    setIsMenuOpen(false);
  };

  const handleDashboardOpen = () => {
    setShowDashboard(true);
    setShowProfileMenu(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/35 bg-[rgba(245,237,230,0.78)] backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-[1380px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-full bg-white/70 px-3 py-2 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-base font-semibold text-white">
              WS
            </span>
            <span className="hidden min-[420px]:block">
              <span className="block font-display text-xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                WebStore
              </span>
              <span className="block text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                Інтернет-магазин
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClasses} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden flex-1 xl:block">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Шукати товар, серію або бренд"
                className="h-12 w-full rounded-full border border-white/35 bg-white/75 pl-12 pr-4 text-sm text-[var(--ink-strong)] outline-none shadow-[var(--shadow-soft)] transition focus:border-[var(--brand-soft)] focus:ring-2 focus:ring-[var(--brand-soft)]"
              />
            </label>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/wishlist"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/75 text-[var(--ink-strong)] shadow-[var(--shadow-soft)] transition hover:border-[var(--brand-soft)] sm:inline-flex"
              aria-label="Обране"
            >
              <Heart className="h-4 w-4" />
            </Link>

            <Link
              to="/cart"
              className="relative inline-flex h-11 items-center gap-2 rounded-full border border-white/35 bg-white/75 px-4 text-sm font-semibold text-[var(--ink-strong)] shadow-[var(--shadow-soft)] transition hover:border-[var(--brand-soft)]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Кошик</span>
              {itemCount > 0 ? (
                <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[var(--ink-strong)] px-1.5 text-[11px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>

            {user ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((value) => !value)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/35 bg-white/75 px-3 text-sm font-medium text-[var(--ink-strong)] shadow-[var(--shadow-soft)]"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-xs font-semibold text-white">
                    {getInitials()}
                  </span>
                  <span className="hidden lg:inline">{user.firstName || user.email.split('@')[0]}</span>
                  <ChevronDown className={`h-4 w-4 transition ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {showProfileMenu ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowProfileMenu(false)}
                      className="fixed inset-0 z-[54] cursor-default"
                    />
                    <div className="absolute right-0 z-[55] mt-3 w-72 overflow-hidden rounded-lg border border-white/45 bg-[var(--surface-elevated)] shadow-[0_28px_60px_-34px_rgba(19,28,45,0.7)]">
                      <div className="border-b border-[var(--line-soft)] px-5 py-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                          Обліковий запис
                        </div>
                        <div className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                          {user.firstName || 'Профіль'}
                        </div>
                        <div className="mt-1 text-sm text-[var(--ink-soft)]">{user.email}</div>
                      </div>
                      <div className="p-2">
                        <button
                          type="button"
                          onClick={handleDashboardOpen}
                          className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm text-[var(--ink-strong)] transition hover:bg-[var(--sand)]"
                        >
                          Кабінет
                        </button>
                        <Link
                          to="/orders"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex rounded-lg px-4 py-3 text-sm text-[var(--ink-strong)] transition hover:bg-[var(--sand)]"
                        >
                          Замовлення
                        </Link>
                        <Link
                          to="/my-products"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex rounded-lg px-4 py-3 text-sm text-[var(--ink-strong)] transition hover:bg-[var(--sand)]"
                        >
                          Мої товари
                        </Link>
                        {isAdmin ? (
                          <Link
                            to="/admin"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex rounded-lg px-4 py-3 text-sm text-[var(--ink-strong)] transition hover:bg-[var(--sand)]"
                          >
                            Адмін-панель
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                            navigate('/');
                          }}
                          className="mt-1 flex w-full rounded-lg px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                        >
                          Вийти
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden h-11 items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(255,107,74,0.75)] sm:inline-flex"
              >
                <User className="h-4 w-4" />
                Увійти
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/75 text-[var(--ink-strong)] shadow-[var(--shadow-soft)] lg:hidden"
              aria-label="Відкрити меню"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="border-t border-white/30">
          <div className="mx-auto flex w-full max-w-[1380px] items-center gap-3 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            <span className="hidden items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)] shadow-[var(--shadow-soft)] sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              Категорії
            </span>
            {categoryDefinitions.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                className={`inline-flex min-w-max items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                  location.pathname === '/catalog' && new URLSearchParams(location.search).get('category') === category.id
                    ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--ink-strong)]'
                    : 'border-white/35 bg-white/60 text-[var(--ink-soft)] hover:border-[var(--brand-soft)] hover:bg-white/80'
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-[60] bg-black/45 lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto border-l border-white/25 bg-[var(--surface-elevated)] px-5 py-5 shadow-[0_28px_60px_-34px_rgba(19,28,45,0.8)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--ink-muted)]">Навігація</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                  Меню магазину
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="mt-6">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Шукати в каталозі"
                  className="h-12 w-full rounded-full border border-[var(--line-soft)] bg-white pl-12 pr-4 text-sm text-[var(--ink-strong)] outline-none focus:border-[var(--brand-soft)]"
                />
              </label>
            </form>

            <div className="mt-6 grid gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={linkClasses}
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-6 grid gap-2">
              {categoryDefinitions.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex items-center gap-3 rounded-lg border border-[var(--line-soft)] bg-white px-4 py-3 text-left text-sm text-[var(--ink-strong)]"
                >
                  <category.icon className="h-4 w-4 text-[var(--brand)]" />
                  {category.label}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-[var(--line-soft)] pt-6">
              {user ? (
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={handleDashboardOpen}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white"
                  >
                    Кабінет
                  </button>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white text-sm font-semibold text-[var(--ink-strong)]"
                  >
                    Замовлення
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      navigate('/');
                    }}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-600"
                  >
                    Вийти
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white"
                >
                  Увійти
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {showDashboard ? <DashboardModal onClose={() => setShowDashboard(false)} /> : null}
    </>
  );
};

export default Navbar;

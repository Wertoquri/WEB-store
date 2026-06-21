import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  GitCompare,
  LogOut,
  MessageSquare,
  Package,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, messagesAPI } from '../services/api';
import { cn } from './ui/utils';
import LoadingSpinner from './LoadingSpinner';

const initialDashboardData = {
  compare: [],
  messages: [],
  orders: [],
  wallet: 2450,
};

const statusLabels = {
  cancelled: 'Скасовано',
  delivered: 'Доставлено',
  pending: 'Очікується',
  processing: 'Обробляється',
  shipped: 'Відправлено',
};

const statusToneMap = {
  cancelled: 'bg-rose-100 text-rose-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-sky-100 text-sky-700',
  shipped: 'bg-indigo-100 text-indigo-700',
};

const tabsConfig = [
  { id: 'overview', label: 'Огляд', icon: TrendingUp },
  { id: 'orders', label: 'Замовлення', icon: Package },
  { id: 'wallet', label: 'Гаманець', icon: Wallet },
  { id: 'compare', label: 'Порівняння', icon: GitCompare },
  { id: 'messages', label: 'Повідомлення', icon: MessageSquare },
];

const modalSurfaceClass =
  'w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/45 bg-[rgba(248,240,234,0.96)] shadow-[0_38px_90px_-42px_rgba(19,28,45,0.55)] backdrop-blur-xl';
const sidebarClass =
  'relative h-full overflow-hidden bg-[linear-gradient(180deg,rgba(25,31,46,0.98)_0%,rgba(19,24,37,0.98)_100%)]';
const cardClass =
  'rounded-2xl border border-white/55 bg-white/80 shadow-[var(--shadow-soft)] backdrop-blur-sm';
const primaryButtonClass =
  'inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_-24px_rgba(255,107,74,0.9)] transition hover:translate-y-[-1px]';
const secondaryButtonClass =
  'inline-flex items-center gap-2 rounded-full border border-[var(--line-soft)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink-strong)] transition hover:border-[var(--brand)]/40 hover:text-[var(--brand)]';
const sidebarPatternStyle = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

const formatMoney = (value) => `$${value.toFixed(2)}`;

const DashboardModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(initialDashboardData);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [ordersResponse, messagesResponse] = await Promise.all([
          ordersAPI.getAll(),
          messagesAPI.getAll().catch(() => ({ data: [] })),
        ]);

        const compareItems = JSON.parse(localStorage.getItem('compare') || '[]');

        setData({
          compare: compareItems,
          messages: messagesResponse.data || [],
          orders: ordersResponse.data || [],
          wallet: 2450,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const unreadMessagesCount = data.messages.filter((message) => !message.isRead).length;
  const totalOrders = data.orders.length;
  const totalSpent = data.orders.reduce((sum, order) => sum + order.total, 0);
  const compareCount = data.compare.length;

  const stats = useMemo(
    () => [
      { id: 'orders', label: 'Замовлень', value: String(totalOrders), icon: Package },
      { id: 'wallet', label: 'На балансі', value: formatMoney(data.wallet), icon: Wallet },
      { id: 'compare', label: 'У порівнянні', value: String(compareCount), icon: GitCompare },
      { id: 'spent', label: 'Витрачено', value: formatMoney(totalSpent), icon: TrendingUp },
    ],
    [compareCount, data.wallet, totalOrders, totalSpent]
  );

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }

    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const closeAndNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleRemoveCompareItem = (productId) => {
    const nextCompare = data.compare.filter((item) => item.id !== productId);
    setData((current) => ({
      ...current,
      compare: nextCompare,
    }));
    localStorage.setItem('compare', JSON.stringify(nextCompare));
    toast.info('Товар прибрано з порівняння');
  };

  const handleMarkMessageRead = async (messageId) => {
    try {
      await messagesAPI.markAsRead(messageId);
    } catch {
      // ignore and still reflect the local state
    }

    setData((current) => ({
      ...current,
      messages: current.messages.map((message) =>
        message.id === messageId ? { ...message, isRead: true } : message
      ),
    }));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.88)_0%,rgba(255,241,232,0.92)_52%,rgba(255,255,255,0.8)_100%)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
          Кабінет
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
          Вітаємо, {user?.firstName || 'користувачу'}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
          Швидкий доступ до замовлень, повідомлень і керування власними товарами в єдиному кабінеті.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.id} className={cn(cardClass, 'p-5')}>
              <div className="grid grid-cols-[minmax(0,1fr),auto] items-start gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                    {item.value}
                  </p>
                </div>
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className={cn(cardClass, 'p-6')}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
              Швидкі дії
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
              Переходьте до замовлень, каталогу або створення товару без зайвих кроків.
            </p>
          </div>

          <button
            type="button"
            onClick={() => closeAndNavigate('/my-products?create=1')}
            className={primaryButtonClass}
          >
            <PlusCircle className="h-5 w-5" />
            Створити продукт
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Замовлення', icon: Package, onClick: () => setActiveTab('orders') },
            { label: 'Кошик', icon: ShoppingBag, onClick: () => closeAndNavigate('/cart') },
            { label: 'Гаманець', icon: Wallet, onClick: () => setActiveTab('wallet') },
            { label: 'Каталог', icon: TrendingUp, onClick: () => closeAndNavigate('/catalog') },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--sand)]/40 px-4 py-4 text-left transition',
                  'hover:border-[var(--brand)]/30 hover:bg-white'
                )}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--brand)] shadow-[var(--shadow-soft)]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-[var(--ink-strong)]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={cn(cardClass, 'p-6')}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
              Останні замовлення
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
              Актуальні статуси по останніх покупках.
            </p>
          </div>
          <button type="button" onClick={() => setActiveTab('orders')} className={secondaryButtonClass}>
            Усі замовлення
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {data.orders.length > 0 ? (
          <div className="mt-6 space-y-3">
            {data.orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--line-soft)] bg-[var(--sand)]/35 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[var(--ink-strong)]">Замовлення #{order.id}</p>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold',
                      statusToneMap[order.status] || statusToneMap.pending
                    )}
                  >
                    {statusLabels[order.status] || statusLabels.pending}
                  </span>
                  <span className="font-display text-2xl font-semibold text-[var(--ink-strong)]">
                    {formatMoney(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--line-soft)] bg-white/50 px-6 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-[var(--ink-muted)]" />
            <p className="mt-4 font-medium text-[var(--ink-strong)]">Ще немає замовлень</p>
          </div>
        )}
      </section>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
          Замовлення
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
          Мої замовлення
        </h2>
      </div>

      {data.orders.length > 0 ? (
        data.orders.map((order) => (
          <article key={order.id} className={cn(cardClass, 'p-6')}>
            <div className="flex flex-col gap-4 border-b border-[var(--line-soft)] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[var(--ink-strong)]">Замовлення #{order.id}</p>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">
                  {new Date(order.createdAt).toLocaleString('uk-UA')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    statusToneMap[order.status] || statusToneMap.pending
                  )}
                >
                  {statusLabels[order.status] || statusLabels.pending}
                </span>
                <span className="font-display text-2xl font-semibold text-[var(--ink-strong)]">
                  {formatMoney(order.total)}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-[var(--sand)]/35 p-3">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[var(--ink-strong)]">{item.product.title}</p>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">Кількість: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-[var(--ink-strong)]">
                    {formatMoney(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))
      ) : (
        <div className={cn(cardClass, 'px-6 py-12 text-center')}>
          <Package className="mx-auto h-14 w-14 text-[var(--ink-muted)]" />
          <p className="mt-4 font-medium text-[var(--ink-strong)]">Ще немає замовлень</p>
        </div>
      )}
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.88)_0%,rgba(255,241,232,0.92)_52%,rgba(255,255,255,0.8)_100%)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
          Гаманець
        </p>
        <p className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
          {formatMoney(data.wallet)}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className={primaryButtonClass}>
            Поповнити
          </button>
          <button type="button" className={secondaryButtonClass}>
            Вивести
          </button>
        </div>
      </section>
    </div>
  );

  const renderCompare = () => (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
          Порівняння
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
          Порівняння товарів
        </h2>
      </div>

      {data.compare.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.compare.map((item) => (
            <article key={item.id} className={cn(cardClass, 'p-4')}>
              <img src={item.image} alt={item.title} className="h-44 w-full rounded-2xl object-cover" />
              <h3 className="mt-4 font-semibold text-[var(--ink-strong)]">{item.title}</h3>
              <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                {formatMoney(item.price)}
              </p>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => closeAndNavigate('/cart')} className={primaryButtonClass}>
                  До кошика
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveCompareItem(item.id)}
                  className={secondaryButtonClass}
                >
                  Видалити
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={cn(cardClass, 'px-6 py-12 text-center')}>
          <GitCompare className="mx-auto h-14 w-14 text-[var(--ink-muted)]" />
          <p className="mt-4 font-medium text-[var(--ink-strong)]">Немає товарів для порівняння</p>
        </div>
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
          Повідомлення
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
          Повідомлення
        </h2>
      </div>

      {data.messages.length > 0 ? (
        <div className="space-y-3">
          {data.messages.map((message) => (
            <button
              key={message.id}
              type="button"
              onClick={() => !message.isRead && handleMarkMessageRead(message.id)}
              className={cn(
                cardClass,
                'w-full p-5 text-left transition',
                !message.isRead ? 'border-[var(--brand)]/30 bg-[var(--brand-soft)]/30' : ''
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--brand)]">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink-strong)]">{message.subject}</p>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">
                      {message.from} • {new Date(message.createdAt).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                </div>
                {!message.isRead ? (
                  <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-white">
                    Нове
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{message.body}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className={cn(cardClass, 'px-6 py-12 text-center')}>
          <MessageSquare className="mx-auto h-14 w-14 text-[var(--ink-muted)]" />
          <p className="mt-4 font-medium text-[var(--ink-strong)]">Наразі повідомлень немає</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return renderOrders();
      case 'wallet':
        return renderWallet();
      case 'compare':
        return renderCompare();
      case 'messages':
        return renderMessages();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className={modalSurfaceClass} onClick={(event) => event.stopPropagation()}>
        <div className="flex h-[90vh] overflow-hidden">
          <aside className="relative hidden md:block md:w-[280px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,74,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(126,231,207,0.12),transparent_28%)]" />
            <div className="absolute inset-0 opacity-[0.07]" style={sidebarPatternStyle} />
            <div className={sidebarClass}>
              <div className="relative z-10 flex h-full flex-col p-6">
                <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] font-semibold text-white shadow-[0_18px_30px_-24px_rgba(255,107,74,0.8)]">
                    {getInitials()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {user?.firstName || 'Користувач'}
                    </p>
                    <p className="truncate text-sm text-white">{user?.email}</p>
                  </div>
                </div>

                <nav className="flex-1 space-y-1.5">
                  {tabsConfig.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const badgeValue = tab.id === 'messages' ? unreadMessagesCount : 0;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white transition',
                          isActive
                            ? 'bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-white shadow-[0_18px_34px_-24px_rgba(255,107,74,0.65)]'
                            : 'bg-transparent text-white hover:bg-white/6'
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0 text-white" />
                        <span className="font-medium text-white">{tab.label}</span>
                        {badgeValue > 0 ? (
                          <span className="ml-auto rounded-full bg-white/18 px-2 py-0.5 text-xs font-semibold text-white">
                            {badgeValue}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </nav>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-white transition hover:bg-white/6"
                >
                  <LogOut className="h-5 w-5 shrink-0 text-white" />
                  <span className="font-medium text-white">Вийти</span>
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_100%)] p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between md:hidden">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] font-semibold text-white">
                  {getInitials()}
                </div>
                <div>
                  <p className="font-semibold text-[var(--ink-strong)]">{user?.firstName || 'Користувач'}</p>
                  <p className="text-sm text-[var(--ink-soft)]">{user?.email}</p>
                </div>
              </div>
              <button type="button" onClick={handleLogout} className={secondaryButtonClass}>
                Вийти
              </button>
            </div>

            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 md:hidden">
              {tabsConfig.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-white'
                        : 'border border-white/12 bg-[rgba(19,24,37,0.92)] text-white'
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;

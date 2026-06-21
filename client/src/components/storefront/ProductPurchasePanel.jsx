import { Heart, ShieldCheck, ShoppingBag, Truck, Zap } from 'lucide-react';
import { formatCurrency, formatReviewsLabel, getStockTone } from '../../lib/storefront';

const ProductPurchasePanel = ({
  product,
  ratingLabel,
  reviewsCount,
  sku,
  colors,
  selectedColor,
  onColorSelect,
  quantity,
  onDecrease,
  onIncrease,
  onAddToCart,
  onToggleWishlist,
  inWishlist,
}) => {
  const stockMeta = getStockTone(product.stock);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-white/60 bg-white/72 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
          <span>{product.category}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--ink-muted)]/60" />
          <span>{sku}</span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)] md:text-[2.8rem]">
          {product.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--ink-soft)]">
          <div className="flex items-center gap-2 rounded-full border border-[var(--line-soft)] bg-[var(--sand)]/80 px-3 py-1.5">
            <span className="font-semibold text-[var(--ink-strong)]">{ratingLabel}</span>
            <span className="text-xs uppercase tracking-[0.2em]">rating</span>
          </div>
          <span>
            {reviewsCount} {formatReviewsLabel(reviewsCount)}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-y border-[var(--line-soft)] py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">Ціна</p>
            <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
              {formatCurrency(product.price)}
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 text-sm font-medium ${stockMeta.tone}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${stockMeta.dot}`} />
            {stockMeta.label}
          </div>
        </div>

        {colors.length > 0 ? (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              Колір
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {colors.map((color, index) => (
                <button
                  key={`${color.name}-${index}`}
                  type="button"
                  onClick={() => onColorSelect(index)}
                  className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm transition ${
                    index === selectedColor
                      ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--ink-strong)]'
                      : 'border-[var(--line-soft)] bg-white text-[var(--ink-soft)] hover:border-[var(--brand-soft)]'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-[auto,1fr,auto]">
          <div className="inline-flex h-14 items-center rounded-full border border-[var(--line-soft)] bg-white px-2">
            <button
              type="button"
              onClick={onDecrease}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg text-[var(--ink-strong)] transition hover:bg-[var(--sand)]"
            >
              -
            </button>
            <span className="min-w-[2rem] text-center text-lg font-semibold text-[var(--ink-strong)]">{quantity}</span>
            <button
              type="button"
              onClick={onIncrease}
              disabled={quantity >= product.stock}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-lg text-[var(--ink-strong)] transition hover:bg-[var(--sand)] disabled:cursor-not-allowed disabled:opacity-35"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onAddToCart}
            disabled={product.stock === 0}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(255,107,74,0.75)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_40px_-22px_rgba(255,107,74,0.9)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ShoppingBag className="h-4 w-4" />
            {product.stock === 0 ? 'Поки недоступно' : 'Додати в кошик'}
          </button>

          <button
            type="button"
            onClick={onToggleWishlist}
            className={`inline-flex h-14 items-center justify-center rounded-full border px-5 transition ${
              inWishlist
                ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
                : 'border-[var(--line-soft)] bg-white text-[var(--ink-strong)] hover:border-[var(--brand-soft)]'
            }`}
            aria-label="Додати в обране"
          >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="mt-6 grid gap-3 border-t border-[var(--line-soft)] pt-5 text-sm text-[var(--ink-soft)]">
          <div className="flex items-center gap-3">
            <Truck className="h-4 w-4 text-[var(--brand)]" />
            Доставка по Україні за 1-3 дні
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-[var(--brand)]" />
            Офіційна гарантія 12 місяців
          </div>
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-[var(--brand)]" />
            Швидке підтвердження замовлення без зайвих кроків
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPurchasePanel;

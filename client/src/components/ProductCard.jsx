import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { cn } from './ui/utils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  formatCurrency,
  formatReviewsLabel,
  getStockTone,
  parseProductColors,
  parseProductImages,
} from '../lib/storefront';

const ProductCard = ({ product, onAddToCart, onToggleWishlist }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentImage, setCurrentImage] = useState(0);

  const images = parseProductImages(product);
  const colors = parseProductColors(product);
  const stockMeta = getStockTone(product.stock);
  const inWishlist = isInWishlist(product.id);
  const reviewsCount = Number(product.reviews || 0);

  const handleAddToCart = (event) => {
    event?.preventDefault();

    if (onAddToCart) {
      onAddToCart(product.id, event);
      return;
    }

    addToCart(product.id);
  };

  const handleToggleWishlist = async (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (onToggleWishlist) {
      await onToggleWishlist(product, event);
      return;
    }

    if (inWishlist) {
      await removeFromWishlist(product.id);
      return;
    }

    await addToWishlist(product);
  };

  const handleHoverImage = () => {
    if (images.length > 1) {
      setCurrentImage((value) => (value + 1) % images.length);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      onMouseEnter={handleHoverImage}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-lg border border-white/55 bg-white/72',
        'shadow-[var(--shadow-soft)] backdrop-blur-xl transition duration-300',
        'hover:-translate-y-1 hover:border-[var(--brand-soft)]'
      )}
    >
      <div className="relative overflow-hidden border-b border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(245,237,230,0.62)_100%)]">
        <img
          src={images[currentImage] || product.image}
          alt={product.title}
          className="aspect-[4/4.25] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />

        <button
          type="button"
          onClick={handleToggleWishlist}
          className={cn(
            'absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-xl transition',
            inWishlist
              ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
              : 'border-white/55 bg-white/72 text-[var(--ink-strong)] hover:border-[var(--brand-soft)]'
          )}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn('h-4 w-4', inWishlist ? 'fill-current' : '')} />
        </button>

        <div className="absolute left-3 top-3 flex items-center gap-2">
          {product.rating >= 4.8 ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-[rgba(12,16,24,0.58)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
              <Star className="h-3 w-3 fill-current" />
              Hit
            </span>
          ) : null}
        </div>

        {colors.length > 0 ? (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {colors.slice(0, 4).map((color, index) => (
              <span
                key={`${color.name}-${index}`}
                className="h-3.5 w-3.5 rounded-full border border-white/60 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
          <span className="inline-flex items-center gap-1 text-[var(--ink-strong)]">
            <Star className="h-3.5 w-3.5 fill-[var(--gold)] text-[var(--gold)]" />
            {(product.rating || 0).toFixed(1)}
          </span>
          <span>
            {reviewsCount} {formatReviewsLabel(reviewsCount)}
          </span>
        </div>

        <h3 className="mt-3 min-h-[3.6rem] font-display text-2xl font-semibold leading-tight tracking-[-0.04em] text-[var(--ink-strong)] transition group-hover:text-[var(--brand)]">
          {product.title}
        </h3>

        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          SKU #{String(product.id).padStart(6, '0')}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Ціна</p>
            <p className="mt-1 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
              {formatCurrency(product.price)}
            </p>
          </div>
          <div className={cn('inline-flex items-center gap-2 text-xs font-medium', stockMeta.tone)}>
            <span className={cn('h-2 w-2 rounded-full', stockMeta.dot)} />
            {stockMeta.label}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={cn(
            'mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white',
            'bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] shadow-[0_18px_40px_-24px_rgba(255,107,74,0.75)]',
            'transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-45'
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          {product.stock === 0 ? 'Недоступно' : 'Швидко до кошика'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

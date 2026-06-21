import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  Star,
  Trash2,
  Truck,
  Video,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ProductGallery from '../components/storefront/ProductGallery';
import ProductPurchasePanel from '../components/storefront/ProductPurchasePanel';
import StoreSectionHeading from '../components/storefront/StoreSectionHeading';
import { cn } from '../components/ui/utils';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency, parseProductColors, parseProductImages, resolveCategoryId } from '../lib/storefront';
import { productsAPI, reviewsAPI } from '../services/api';

const categorySpecs = {
  Smartphones: [
    ['Дисплей', 'display'],
    ['Процесор', 'processor'],
    ["Пам'ять", 'memory'],
    ['Камера', 'camera'],
    ['Батарея', 'battery'],
    ['ОС', 'os'],
  ],
  Laptops: [
    ['Дисплей', 'display'],
    ['Процесор', 'processor'],
    ["Оперативна пам'ять", 'ram'],
    ['Накопичувач', 'storage'],
    ['Відеокарта', 'gpu'],
    ['ОС', 'os'],
  ],
  Audio: [
    ['Тип', 'type'],
    ['Драйвер', 'driver'],
    ['Частотний діапазон', 'frequency'],
    ['Імпеданс', 'impedance'],
    ['Шумозаглушення', 'anc'],
    ['Час роботи', 'battery'],
  ],
  Wearables: [
    ['Дисплей', 'display'],
    ['Сумісність', 'compatibility'],
    ['Датчики', 'sensors'],
    ['Захист', 'waterproof'],
    ['Батарея', 'battery'],
  ],
  Tablets: [
    ['Дисплей', 'display'],
    ['Процесор', 'processor'],
    ["Пам'ять", 'memory'],
    ['Камера', 'camera'],
    ['Батарея', 'battery'],
    ['ОС', 'os'],
  ],
  Gaming: [
    ['Тип', 'type'],
    ["Пам'ять", 'memory'],
    ['Роздільна здатність', 'resolution'],
    ['Підключення', 'connectivity'],
    ['Контролери', 'controllers'],
  ],
  Cameras: [
    ['Матриця', 'sensor'],
    ['Роздільна здатність', 'resolution'],
    ["Об'єктив", 'lens'],
    ['Відео', 'video'],
    ['Стабілізація', 'stabilization'],
  ],
  TVs: [
    ['Діагональ', 'size'],
    ['Роздільна здатність', 'resolution'],
    ['Тип матриці', 'panel'],
    ['Smart TV', 'smart'],
    ['HDR', 'hdr'],
    ['Частота', 'refresh'],
  ],
  Home: [
    ['Тип', 'type'],
    ['Потужність', 'power'],
    ["Об'єм", 'capacity'],
    ['Рівень шуму', 'noise'],
    ['Вага', 'weight'],
  ],
};

const pageTransition = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const MAX_REVIEW_VIDEO_SIZE = 20 * 1024 * 1024;
const reviewComposerClass =
  'mt-8 rounded-lg border border-[var(--line-soft)] bg-white/80 p-5';
const reviewUploadTriggerClass =
  'inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--line-soft)] bg-white px-4 py-3 text-sm text-[var(--ink-strong)]';
const reviewPreviewCardClass =
  'relative overflow-hidden rounded-lg border border-[var(--line-soft)]';
const reviewPreviewRemoveButtonClass =
  'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewFiles, setReviewFiles] = useState([]);
  const [reviewVideo, setReviewVideo] = useState(null);
  const [reviewVideoPreview, setReviewVideoPreview] = useState(null);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [activeReplyForm, setActiveReplyForm] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replySubmittingId, setReplySubmittingId] = useState(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const images = parseProductImages(product);
  const colors = parseProductColors(product);
  const specs = product ? categorySpecs[product.category] || [] : [];
  const ratingLabel = product?.rating > 0 ? product.rating.toFixed(1) : 'New';
  const sku = product ? `#${String(product.id).padStart(6, '0')}` : '';

  useEffect(() => {
    if (!reviewVideo) {
      setReviewVideoPreview(null);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(reviewVideo);
    setReviewVideoPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [reviewVideo]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        setProduct(response.data);
        setError('');
        setCurrentImage(0);
        setSelectedColor(0);
        setQuantity(1);
      } catch (requestError) {
        if (requestError.code === 'AUTH_REQUIRED') {
          toast.error('Сесія завершилась. Увійдіть знову.');
          navigate('/login');
          return;
        }

        setError('Товар не знайдено.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await reviewsAPI.getProductReviews(id);
        setReviews(response.data);
      } catch (requestError) {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' && currentImage < images.length - 1) {
        setCurrentImage((value) => value + 1);
      }

      if (event.key === 'ArrowLeft' && currentImage > 0) {
        setCurrentImage((value) => value - 1);
      }

      if (event.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImage, images.length]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await reviewsAPI.getProductReviews(id);
      setReviews(response.data);
    } catch (requestError) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
      setError('');
      setCurrentImage(0);
      setSelectedColor(0);
      setQuantity(1);
    } catch (requestError) {
      setError('Товар не знайдено.');
    } finally {
      setLoading(false);
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) <= 50 || images.length <= 1) {
      return;
    }

    if (diff > 0 && currentImage < images.length - 1) {
      setCurrentImage((value) => value + 1);
    }

    if (diff < 0 && currentImage > 0) {
      setCurrentImage((value) => value - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Увійдіть, щоб додати товар у кошик.');
      navigate('/login');
      return;
    }

    try {
      const selectedColorName = colors[selectedColor]?.name || null;
      await addToCart(product.id, quantity, selectedColorName);
      toast.success('Товар додано в кошик.', {
        description: product.title,
      });
    } catch (requestError) {
      toast.error('Не вдалося додати товар у кошик.');
    }
  };

  const handleToggleWishlist = () => {
    if (!product) {
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info('Товар прибрано з обраного.');
      return;
    }

    addToWishlist(product);
    toast.success('Товар додано в обране.');
  };

  const handleReviewImagesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const newFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setReviewFiles((previous) => {
      const combinedFiles = [...previous, ...newFiles];
      const visibleFiles = combinedFiles.slice(0, 5);
      const hiddenFiles = combinedFiles.slice(5);

      hiddenFiles.forEach((item) => URL.revokeObjectURL(item.preview));

      if (combinedFiles.length > 5) {
        toast.info('До відгуку можна додати до 5 фото.');
      }

      return visibleFiles;
    });

    event.target.value = '';
  };

  const handleReviewVideoChange = (event) => {
    const nextVideo = event.target.files?.[0] || null;

    if (!nextVideo) {
      return;
    }

    if (nextVideo.size > MAX_REVIEW_VIDEO_SIZE) {
      const message = 'Відео для відгуку має бути не більше 20 МБ.';

      setReviewError(message);
      toast.error(message);
      event.target.value = '';
      return;
    }

    setReviewError('');
    setReviewVideo(nextVideo);
    event.target.value = '';
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user) {
      toast.error('Увійдіть, щоб залишити відгук.');
      return;
    }

    try {
      const reviewPayload = new FormData();
      reviewPayload.append('productId', String(product.id));
      reviewPayload.append('rating', String(reviewForm.rating));

      if (reviewForm.comment.trim()) {
        reviewPayload.append('comment', reviewForm.comment.trim());
      }

      reviewFiles.forEach((item) => {
        reviewPayload.append('images', item.file);
      });

      if (reviewVideo) {
        reviewPayload.append('video', reviewVideo);
      }

      await reviewsAPI.createReview(reviewPayload);

      toast.success('Відгук опубліковано.');
      setReviewSuccess('Відгук успішно додано.');
      setReviewForm({ rating: 5, comment: '' });
      setReviewFiles((previous) => {
        previous.forEach((item) => URL.revokeObjectURL(item.preview));
        return [];
      });
      setReviewVideo(null);
      setReviewVideoPreview(null);
      setShowReviewForm(false);
      await fetchReviews();
      await fetchProduct();
    } catch (requestError) {
      setReviewError(requestError.response?.data?.error || 'Не вдалося додати відгук.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Видалити цей відгук?')) {
      return;
    }

    try {
      await reviewsAPI.deleteReview(reviewId);
      toast.success('Відгук видалено.');
      await fetchReviews();
      await fetchProduct();
    } catch (requestError) {
      toast.error('Не вдалося видалити відгук.');
    }
  };

  const handleReplyDraftChange = (reviewId, value) => {
    setReplyDrafts((previous) => ({
      ...previous,
      [reviewId]: value,
    }));
  };

  const handleReplyEditorOpen = (review) => {
    setActiveReplyForm(review.id);
    setReplyDrafts((previous) => ({
      ...previous,
      [review.id]: previous[review.id] ?? review.reply ?? '',
    }));
  };

  const handleReplySubmit = async (reviewId) => {
    const reply = replyDrafts[reviewId]?.trim();

    if (!reply) {
      toast.error('Введіть текст відповіді.');
      return;
    }

    try {
      setReplySubmittingId(reviewId);
      await reviewsAPI.replyToReview(reviewId, { reply });
      toast.success('Відповідь на відгук збережено.');
      setActiveReplyForm(null);
      await fetchReviews();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || 'Не вдалося зберегти відповідь.');
    } finally {
      setReplySubmittingId(null);
    }
  };

  const closeReviewComposer = () => {
    reviewFiles.forEach((item) => URL.revokeObjectURL(item.preview));
    setReviewFiles([]);
    setReviewVideo(null);
    setReviewVideoPreview(null);
    setReviewError('');
    setShowReviewForm(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="mx-auto w-full max-w-[1380px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/55 bg-white/72 p-8 shadow-[var(--shadow-soft)]">
          <ErrorMessage message={error || 'Товар не знайдено.'} />
          <Link
            to="/catalog"
            className="mt-6 inline-flex h-12 items-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white"
          >
            Повернутись у каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="store-page pb-32"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <section className="border-b border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.64)_0%,rgba(255,255,255,0)_100%)]">
        <div className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            <Link to="/" className="transition hover:text-[var(--ink-strong)]">
              Головна
            </Link>
            <span>/</span>
            <Link to={`/catalog?category=${resolveCategoryId(product.category)}`} className="transition hover:text-[var(--ink-strong)]">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[var(--ink-strong)]">{product.title}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr] xl:grid-cols-[1.1fr,0.9fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery
              images={images}
              title={product.title}
              currentImage={currentImage}
              onImageChange={setCurrentImage}
              isZoomed={isZoomed}
              onZoomToggle={() => setIsZoomed((value) => !value)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>

          <div className="space-y-6">
            <ProductPurchasePanel
              product={product}
              ratingLabel={ratingLabel}
              reviewsCount={product.reviews || 0}
              sku={sku}
              colors={colors}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              quantity={quantity}
              onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
              onIncrease={() => setQuantity((value) => Math.min(product.stock, value + 1))}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              inWishlist={isInWishlist(product.id)}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-white/55 bg-white/70 p-5 shadow-[var(--shadow-soft)]">
                <Truck className="h-5 w-5 text-[var(--brand)]" />
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                  Доставка по Україні
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  Доставляємо замовлення по Україні, а основна інформація про товар і покупку завжди лишається під рукою.
                </p>
              </div>
              <div className="rounded-lg border border-white/55 bg-white/70 p-5 shadow-[var(--shadow-soft)]">
                <ShieldCheck className="h-5 w-5 text-[var(--brand)]" />
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                  Гарантія та сервіс
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  На сторінці одразу видно рейтинг, наявність, характеристики та умови гарантії, щоб було легше прийняти рішення.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1380px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.1fr,0.9fr] lg:px-8">
        <div className="rounded-lg border border-white/55 bg-white/72 p-6 shadow-[var(--shadow-soft)]">
          <StoreSectionHeading
            eyebrow="Опис товару"
            title="Головне про товар коротко і зрозуміло."
            description="Тут зібрано все, що варто знати перед покупкою: призначення товару, його переваги та важливі деталі використання."
          />
          <p className="text-sm leading-8 text-[var(--ink-soft)] sm:text-base">{product.description}</p>
        </div>

        <div className="rounded-lg border border-white/55 bg-white/72 p-6 shadow-[var(--shadow-soft)]">
          <StoreSectionHeading
            eyebrow="Характеристики"
            title="Основні параметри в одному зручному списку."
            description="Порівнюйте важливі характеристики товару без зайвих переходів і швидко знаходьте потрібну інформацію."
          />
          <div className="grid gap-3">
            {specs.map(([label, key]) => (
              <div key={key} className="flex items-center justify-between gap-4 rounded-lg border border-[var(--line-soft)] bg-white/70 px-4 py-3 text-sm">
                <span className="text-[var(--ink-muted)]">{label}</span>
                <span className="text-right font-medium text-[var(--ink-strong)]">{product[key] || '—'}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--line-soft)] bg-white/70 px-4 py-3 text-sm">
              <span className="text-[var(--ink-muted)]">Гарантія</span>
              <span className="font-medium text-[var(--ink-strong)]">12 місяців</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--line-soft)] bg-white/70 px-4 py-3 text-sm">
              <span className="text-[var(--ink-muted)]">Доставка</span>
              <span className="font-medium text-[var(--ink-strong)]">1-3 дні по Україні</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/55 bg-white/72 p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">Відгуки</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
                Відгуки {product.reviews > 0 ? `(${product.reviews})` : ''}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                Читайте оцінки покупців, переглядайте фото й відео у відгуках та знайомтеся з відповідями магазину.
              </p>
            </div>
            {user ? (
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white"
              >
                <MessageSquare className="h-4 w-4" />
                Написати відгук
              </button>
            ) : null}
          </div>

          {reviewError ? <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{reviewError}</div> : null}
          {reviewSuccess ? <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{reviewSuccess}</div> : null}

          {showReviewForm ? (
            <form onSubmit={handleSubmitReview} className={reviewComposerClass}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink-muted)]">Новий відгук</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                    Поділіться досвідом
                  </h3>
                </div>
                <button type="button" onClick={closeReviewComposer} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm((current) => ({ ...current, rating: star }))}
                    className={cn(
                      'inline-flex h-11 w-11 items-center justify-center rounded-full border transition',
                      star <= reviewForm.rating
                        ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
                        : 'border-[var(--line-soft)] bg-white text-[var(--ink-muted)]'
                    )}
                  >
                    <Star className={`h-4 w-4 ${star <= reviewForm.rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewForm.comment}
                onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                rows="4"
                placeholder="Що сподобалось, що було зручним у використанні, чи виправдав товар очікування?"
                className="mt-5 w-full rounded-lg border border-[var(--line-soft)] bg-white px-4 py-3 text-sm text-[var(--ink-strong)] outline-none focus:border-[var(--brand-soft)] focus:ring-2 focus:ring-[var(--brand-soft)]"
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <label className={reviewUploadTriggerClass}>
                  <ImageIcon className="h-4 w-4" />
                  Додати фото
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleReviewImagesChange}
                  />
                </label>
                <label className={reviewUploadTriggerClass}>
                  <Video className="h-4 w-4" />
                  Додати відео
                  <input
                    type="file"
                    accept="video/mp4,video/webm,.mp4,.webm"
                    hidden
                    onChange={handleReviewVideoChange}
                  />
                </label>
              </div>
              <p className="mt-3 text-xs leading-6 text-[var(--ink-muted)]">
                До 5 фото та 1 відео. Для коректного відтворення підтримуються MP4 або WEBM, максимум 20 МБ.
              </p>

              {reviewFiles.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {reviewFiles.map((item, index) => (
                    <div key={item.preview} className={reviewPreviewCardClass}>
                      <img src={item.preview} alt={`preview ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(item.preview);
                          setReviewFiles((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
                        }}
                        className={reviewPreviewRemoveButtonClass}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {reviewVideoPreview ? (
                <div className={cn('mt-5', reviewPreviewCardClass)}>
                  <video src={reviewVideoPreview} controls playsInline preload="metadata" className="aspect-video w-full bg-black" />
                  <button
                    type="button"
                    onClick={() => setReviewVideo(null)}
                    className={reviewPreviewRemoveButtonClass}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white"
              >
                Опублікувати відгук
              </button>
            </form>
          ) : null}

          {reviewsLoading ? (
            <div className="mt-8">
              <LoadingSpinner />
            </div>
          ) : null}

          {!reviewsLoading && reviews.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-[var(--line-soft)] bg-white/60 px-6 py-12 text-center">
              <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                Поки що без відгуків.
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                Станьте першим, хто поділиться враженнями про цей товар.
              </p>
            </div>
          ) : null}

          {!reviewsLoading && reviews.length > 0 ? (
            <div className="mt-8 grid gap-5">
              {reviews.map((review) => {
                const reviewImages = review.images ? (() => {
                  try {
                    return JSON.parse(review.images);
                  } catch {
                    return [];
                  }
                })() : [];

                const isOwner = user && review.userId === user.id;
                const hasReply = Boolean(review.reply?.trim());
                const replyDraft = replyDrafts[review.id] ?? review.reply ?? '';
                const isReplyOpen = activeReplyForm === review.id;

                return (
                  <div key={review.id} className="rounded-lg border border-[var(--line-soft)] bg-white/78 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-soft)] text-sm font-semibold text-[var(--brand)]">
                          {review.user.firstName?.[0] || review.user.email[0]}
                        </span>
                        <div>
                          <p className="font-medium text-[var(--ink-strong)]">{review.user.firstName || review.user.email}</p>
                          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                            {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${index < review.rating ? 'fill-[var(--gold)] text-[var(--gold)]' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                        {isOwner ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600"
                            aria-label="Видалити відгук"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {review.comment ? <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{review.comment}</p> : null}

                    {reviewImages.length > 0 ? (
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {reviewImages.map((image, index) => (
                          <a key={`${image}-${index}`} href={image} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-[var(--line-soft)]">
                            <img src={image} alt={`review media ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                          </a>
                        ))}
                      </div>
                    ) : null}

                    {review.video ? (
                      <div className="mt-5 overflow-hidden rounded-lg border border-[var(--line-soft)]">
                        <video
                          src={review.video}
                          controls
                          playsInline
                          preload="metadata"
                          crossOrigin="anonymous"
                          className="aspect-video w-full bg-black"
                        />
                      </div>
                    ) : null}

                    {hasReply ? (
                      <div className="mt-5 rounded-lg border border-[rgba(126,231,207,0.36)] bg-[rgba(126,231,207,0.12)] p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">Відповідь магазину</p>
                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--ink-soft)]">{review.reply}</p>
                      </div>
                    ) : null}

                    {isAdmin ? (
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => handleReplyEditorOpen(review)}
                          className="inline-flex h-11 items-center rounded-full border border-[var(--line-soft)] bg-white px-5 text-sm font-semibold text-[var(--ink-strong)]"
                        >
                          {hasReply ? 'Редагувати відповідь' : 'Відповісти на відгук'}
                        </button>
                      </div>
                    ) : null}

                    {isAdmin && isReplyOpen ? (
                      <div className="mt-5 rounded-lg border border-[var(--line-soft)] bg-[var(--sand)]/55 p-4">
                        <textarea
                          value={replyDraft}
                          onChange={(event) => handleReplyDraftChange(review.id, event.target.value)}
                          rows="4"
                          placeholder="Напишіть відповідь від імені магазину..."
                          className="w-full rounded-lg border border-[var(--line-soft)] bg-white px-4 py-3 text-sm text-[var(--ink-strong)] outline-none focus:border-[var(--brand-soft)] focus:ring-2 focus:ring-[var(--brand-soft)]"
                        />
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleReplySubmit(review.id)}
                            disabled={replySubmittingId === review.id}
                            className="inline-flex h-11 items-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-5 text-sm font-semibold text-white disabled:opacity-45"
                          >
                            {replySubmittingId === review.id ? 'Зберігаємо...' : 'Зберегти відповідь'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveReplyForm(null)}
                            className="inline-flex h-11 items-center rounded-full border border-[var(--line-soft)] bg-white px-5 text-sm font-semibold text-[var(--ink-strong)]"
                          >
                            Скасувати
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4 rounded-full border border-white/45 bg-[rgba(18,24,38,0.92)] px-5 py-3 text-white shadow-[0_28px_60px_-34px_rgba(19,28,45,0.9)] backdrop-blur-2xl">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">До покупки</div>
            <div className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em]">{formatCurrency(product.price)}</div>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-5 text-sm font-semibold text-white disabled:opacity-45"
          >
            {product.stock === 0 ? 'Недоступно' : 'В кошик'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPage;

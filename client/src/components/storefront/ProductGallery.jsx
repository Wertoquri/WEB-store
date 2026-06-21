import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

const ProductGallery = ({
  images,
  title,
  currentImage,
  onImageChange,
  isZoomed,
  onZoomToggle,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  const hasMultipleImages = images.length > 1;

  const showPrevious = (event) => {
    event?.stopPropagation();
    if (!hasMultipleImages) {
      return;
    }

    onImageChange(currentImage === 0 ? images.length - 1 : currentImage - 1);
  };

  const showNext = (event) => {
    event?.stopPropagation();
    if (!hasMultipleImages) {
      return;
    }

    onImageChange(currentImage === images.length - 1 ? 0 : currentImage + 1);
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className="group relative overflow-hidden rounded-lg border border-white/50 bg-white/55 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffffaa_0%,transparent_60%)]" />
          <button
            type="button"
            onClick={onZoomToggle}
            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-black/35 text-white transition hover:bg-black/55"
            aria-label="Відкрити збільшення"
          >
            <Expand className="h-4 w-4" />
          </button>
          {hasMultipleImages ? (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/35 text-white transition hover:bg-black/55"
                aria-label="Попереднє фото"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/35 text-white transition hover:bg-black/55"
                aria-label="Наступне фото"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
          <motion.img
            key={images[currentImage]}
            src={images[currentImage]}
            alt={title}
            className="aspect-[4/4.4] w-full object-cover"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          {hasMultipleImages ? (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/40 bg-black/40 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
              <span>{currentImage + 1}</span>
              <span className="opacity-60">/</span>
              <span>{images.length}</span>
            </div>
          ) : null}
        </div>

        {hasMultipleImages ? (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => onImageChange(index)}
                className={`overflow-hidden rounded-lg border transition ${
                  index === currentImage
                    ? 'border-[var(--brand)] shadow-[var(--shadow-soft)]'
                    : 'border-white/40 bg-white/55 hover:border-[var(--brand-soft)]'
                }`}
              >
                <img src={image} alt={`${title} ${index + 1}`} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {isZoomed ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/88 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onZoomToggle}
          >
            <button
              type="button"
              onClick={onZoomToggle}
              className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Закрити"
            >
              <X className="h-5 w-5" />
            </button>
            {hasMultipleImages ? (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-6 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Попереднє фото"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-6 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Наступне фото"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
            <motion.img
              key={`zoom-${images[currentImage]}`}
              src={images[currentImage]}
              alt={title}
              className="max-h-[85vh] max-w-[88vw] rounded-lg object-contain shadow-2xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default ProductGallery;

import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  ALL_CATEGORY,
  categoryDefinitions,
  formatCurrency,
  resolveCategoryLabel,
  sortOptions,
} from '../../lib/storefront';

const numberInputClasses =
  'h-11 w-full rounded-lg border border-[var(--line-soft)] bg-white/65 px-3 text-sm text-[var(--ink-strong)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)]';

const CatalogFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceMin,
  onPriceMinChange,
  priceMax,
  onPriceMaxChange,
  sortBy,
  onSortChange,
  totalProducts,
  onReset,
  compact = false,
}) => {
  const activeFilters =
    (selectedCategory && selectedCategory !== ALL_CATEGORY ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (priceMin !== '' || priceMax !== '' ? 1 : 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
            Навігація по каталогу
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">
            Фільтри та сортування
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
            {selectedCategory !== ALL_CATEGORY
              ? `${resolveCategoryLabel(selectedCategory)} · ${totalProducts} товарів`
              : `${totalProducts} товарів у каталозі`}
          </p>
        </div>
        {activeFilters > 0 ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--line-soft)] bg-white/70 px-4 text-xs font-semibold text-[var(--ink-strong)] transition hover:border-[var(--brand-soft)] hover:bg-white"
          >
            <X className="h-4 w-4" />
            Очистити
          </button>
        ) : null}
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          Пошук
        </span>
        <span className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Бренд, модель або серія"
            className="h-12 w-full rounded-lg border border-[var(--line-soft)] bg-white/65 pl-11 pr-4 text-sm text-[var(--ink-strong)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)]"
          />
        </span>
      </label>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[var(--brand)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Категорії
          </span>
        </div>
        <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <button
            type="button"
            onClick={() => onCategoryChange(ALL_CATEGORY)}
            className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition ${
              selectedCategory === ALL_CATEGORY
                ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--ink-strong)] shadow-[var(--shadow-soft)]'
                : 'border-[var(--line-soft)] bg-white/60 text-[var(--ink-soft)] hover:border-[var(--brand-soft)] hover:bg-white'
            }`}
          >
            <span>Усі категорії</span>
            <span className="text-[10px] uppercase tracking-[0.2em]">Store</span>
          </button>
          {categoryDefinitions.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition ${
                  selectedCategory === category.id
                    ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--ink-strong)] shadow-[var(--shadow-soft)]'
                    : 'border-[var(--line-soft)] bg-white/60 text-[var(--ink-soft)] hover:border-[var(--brand-soft)] hover:bg-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {category.label}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em]">{category.dbValue}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Ціна від
          </span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={priceMin}
            onChange={(event) => onPriceMinChange(event.target.value)}
            placeholder="0"
            className={numberInputClasses}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Ціна до
          </span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={priceMax}
            onChange={(event) => onPriceMaxChange(event.target.value)}
            placeholder={formatCurrency(5000)}
            className={numberInputClasses}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          Сортування
        </span>
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-12 w-full rounded-lg border border-[var(--line-soft)] bg-white/65 px-4 text-sm text-[var(--ink-strong)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default CatalogFilters;

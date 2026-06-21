import {
  Camera,
  Gamepad2,
  Headphones,
  Laptop,
  MonitorPlay,
  Smartphone,
  TabletSmartphone,
  Watch,
  Waves,
} from 'lucide-react';

export const ALL_CATEGORY = 'all';
export const PRODUCTS_PER_PAGE = 12;

export const categoryDefinitions = [
  { id: 'smartphones', label: 'Смартфони', dbValue: 'Smartphones', icon: Smartphone },
  { id: 'laptops', label: 'Ноутбуки', dbValue: 'Laptops', icon: Laptop },
  { id: 'audio', label: 'Аудіо', dbValue: 'Audio', icon: Headphones },
  { id: 'wearables', label: 'Годинники', dbValue: 'Wearables', icon: Watch },
  { id: 'tablets', label: 'Планшети', dbValue: 'Tablets', icon: TabletSmartphone },
  { id: 'gaming', label: 'Геймінг', dbValue: 'Gaming', icon: Gamepad2 },
  { id: 'cameras', label: 'Камери', dbValue: 'Cameras', icon: Camera },
  { id: 'tvs', label: 'ТБ та дисплеї', dbValue: 'TVs', icon: MonitorPlay },
  { id: 'home', label: 'Дім', dbValue: 'Home', icon: Waves },
];

export const sortOptions = [
  { value: 'newest', label: 'Спочатку новинки' },
  { value: 'price_asc', label: 'Ціна: від нижчої' },
  { value: 'price_desc', label: 'Ціна: від вищої' },
  { value: 'rating', label: 'Найвищий рейтинг' },
  { value: 'name_asc', label: 'Назва: А-Я' },
];

const categoryById = Object.fromEntries(categoryDefinitions.map((category) => [category.id, category]));
const categoryByDb = Object.fromEntries(categoryDefinitions.map((category) => [category.dbValue, category]));
const categoryByLabel = Object.fromEntries(categoryDefinitions.map((category) => [category.label, category]));

export const getCategoryDefinition = (value) => {
  if (!value) {
    return null;
  }

  return categoryById[value] || categoryByDb[value] || categoryByLabel[value] || null;
};

export const resolveDbCategory = (value) => getCategoryDefinition(value)?.dbValue || null;
export const resolveCategoryId = (value) => getCategoryDefinition(value)?.id || ALL_CATEGORY;
export const resolveCategoryLabel = (value) => getCategoryDefinition(value)?.label || value || 'Усі товари';

export const buildCatalogPath = ({ categoryId = ALL_CATEGORY, search = '' } = {}) => {
  const params = new URLSearchParams();

  if (categoryId && categoryId !== ALL_CATEGORY) {
    params.set('category', categoryId);
  }

  if (search.trim()) {
    params.set('search', search.trim());
  }

  const query = params.toString();
  return query ? `/catalog?${query}` : '/catalog';
};

export const parseProductImages = (product) => {
  if (!product) {
    return [];
  }

  if (!product.images) {
    return product.image ? [product.image] : [];
  }

  try {
    const images = JSON.parse(product.images);
    return Array.isArray(images) && images.length > 0 ? images : product.image ? [product.image] : [];
  } catch {
    return product.image ? [product.image] : [];
  }
};

export const parseProductColors = (product) => {
  if (!product?.colors) {
    return [];
  }

  try {
    const colors = JSON.parse(product.colors);
    return Array.isArray(colors) ? colors : [];
  } catch {
    return [];
  }
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value || 0);

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat('uk-UA', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value || 0);

export const formatReviewsLabel = (count) => {
  const normalized = Math.abs(Number(count)) || 0;
  const remainderTen = normalized % 10;
  const remainderHundred = normalized % 100;

  if (remainderHundred >= 11 && remainderHundred <= 14) {
    return 'відгуків';
  }

  if (remainderTen === 1) {
    return 'відгук';
  }

  if (remainderTen >= 2 && remainderTen <= 4) {
    return 'відгуки';
  }

  return 'відгуків';
};

export const getStockTone = (stock) => {
  if (stock <= 0) {
    return { label: 'Немає в наявності', tone: 'text-rose-500', dot: 'bg-rose-500' };
  }

  if (stock <= 5) {
    return { label: `Майже розібрали · ${stock} шт.`, tone: 'text-amber-600', dot: 'bg-amber-500' };
  }

  return { label: `В наявності · ${stock} шт.`, tone: 'text-emerald-600', dot: 'bg-emerald-500' };
};

export const clampPage = (page, totalPages) => Math.min(Math.max(page, 1), Math.max(totalPages, 1));

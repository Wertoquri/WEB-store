import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { buildCatalogPath, categoryDefinitions } from '../lib/storefront';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.55)_18%,rgba(255,255,255,0.84)_100%)]">
      <div className="mx-auto grid w-full max-w-[1380px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr,0.8fr,0.8fr,1fr] lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)] shadow-[var(--shadow-soft)]">
            <Sparkles className="h-3.5 w-3.5" />
            Storefront system
          </p>
          <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)]">
            WebStore виглядає як цілісний digital product, а не набір окремих екранів.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--ink-soft)]">
            Нова айдентика тримається на редакційній типографіці, теплій базі, кораловому CTA та скляних сервісних
            поверхнях.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-[var(--ink-soft)]">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[var(--brand)]" />
              +380 (44) 123-45-67
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[var(--brand)]" />
              info@webstore.com
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[var(--brand)]" />
              Київ, Хрещатик 1
            </div>
            <div className="flex items-center gap-3">
              <Clock3 className="h-4 w-4 text-[var(--brand)]" />
              Пн-Пт 09:00-20:00
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">Каталог</h3>
          <div className="mt-5 grid gap-2">
            {categoryDefinitions.map((category) => (
              <Link
                key={category.id}
                to={buildCatalogPath({ categoryId: category.id })}
                className="inline-flex items-center justify-between rounded-lg border border-white/45 bg-white/55 px-4 py-3 text-sm text-[var(--ink-soft)] transition hover:border-[var(--brand-soft)] hover:text-[var(--ink-strong)]"
              >
                <span>{category.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">Сервіси</h3>
          <div className="mt-5 grid gap-2">
            {[
              { to: '/delivery', label: 'Доставка та оплата' },
              { to: '/warranty', label: 'Гарантія' },
              { to: '/contacts', label: 'Контакти' },
              { to: '/bonuses', label: 'Бонусна програма' },
              { to: '/trade-in', label: 'Trade-in' },
              { to: '/credit', label: 'Розстрочка' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex items-center justify-between rounded-lg border border-white/45 bg-white/55 px-4 py-3 text-sm text-[var(--ink-soft)] transition hover:border-[var(--brand-soft)] hover:text-[var(--ink-strong)]"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/55 bg-[rgba(19,28,45,0.94)] p-6 text-white shadow-[0_28px_60px_-34px_rgba(19,28,45,0.7)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Newsletter</p>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em]">
            Новини без спаму.
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/72">
            Анонси нових релізів, зниження цін і добірки, які дійсно допомагають вибору.
          </p>
          <form className="mt-6 grid gap-3">
            <input
              type="email"
              placeholder="Ваш email"
              className="h-12 rounded-full border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-6 text-sm font-semibold text-white"
            >
              Підписатися
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/35">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-3 px-4 py-5 text-sm text-[var(--ink-soft)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© {currentYear} WebStore. Усі права захищені.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/privacy" className="transition hover:text-[var(--ink-strong)]">
              Політика конфіденційності
            </Link>
            <Link to="/offer" className="transition hover:text-[var(--ink-strong)]">
              Публічна оферта
            </Link>
            <Link to="/sitemap" className="transition hover:text-[var(--ink-strong)]">
              Карта сайту
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

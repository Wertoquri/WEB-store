import { Link } from 'react-router-dom';
import { Map, ChevronRight } from 'lucide-react';

const siteStructure = [
  {
    title: 'Головна сторінка',
    url: '/',
    children: []
  },
  {
    title: 'Каталог товарів',
    url: '/',
    children: [
      { title: 'Смартфони', url: '/?category=smartphones' },
      { title: 'Ноутбуки', url: '/?category=laptops' },
      { title: 'Аудіо', url: '/?category=audio' },
      { title: 'Годинники', url: '/?category=wearables' },
      { title: 'Планшети', url: '/?category=tablets' },
      { title: 'Ігрові консолі', url: '/?category=gaming' },
      { title: 'Камери', url: '/?category=cameras' },
      { title: 'Телевізори', url: '/?category=tvs' },
      { title: 'Дім', url: '/?category=home' },
    ]
  },
  {
    title: 'Кошик',
    url: '/cart',
    children: []
  },
  {
    title: 'Оформлення замовлення',
    url: '/checkout',
    children: []
  },
  {
    title: 'Мої замовлення',
    url: '/orders',
    children: []
  },
  {
    title: 'Особистий кабінет',
    url: '/profile',
    children: []
  },
  {
    title: 'Відстеження замовлення',
    url: '/profile/orders',
    children: []
  },
  {
    title: 'Адмін панель',
    url: '/admin',
    children: []
  },
  {
    title: 'Інформація',
    url: '#',
    children: [
      { title: 'Доставка та оплата', url: '/delivery' },
      { title: 'Гарантія та повернення', url: '/warranty' },
      { title: 'Контакти', url: '/contacts' },
      { title: 'Бонусна програма', url: '/bonuses' },
      { title: 'Трейд-ін', url: '/trade-in' },
      { title: 'Розстрочка', url: '/credit' },
      { title: 'Акції та знижки', url: '/promotions' },
    ]
  },
  {
    title: 'Правові документи',
    url: '#',
    children: [
      { title: 'Політика конфіденційності', url: '/privacy' },
      { title: 'Публічна оферта', url: '/offer' },
    ]
  },
  {
    title: 'Авторизація',
    url: '/login',
    children: [
      { title: 'Реєстрація', url: '/register' },
    ]
  },
];

const SitemapPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#075985] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Map className="w-10 h-10" />
            <h1 className="text-4xl font-bold tracking-tight">Карта сайту</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">
            Повна структура всіх розділів WebStore
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <ul className="space-y-2">
              {siteStructure.map((section, index) => (
                <li key={index} className="py-2">
                  <Link
                    to={section.url}
                    className="text-lg font-semibold text-gray-900 hover:text-[#0284c7] transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="w-5 h-5 text-[#0284c7]" />
                    {section.title}
                  </Link>
                  {section.children.length > 0 && (
                    <ul className="ml-8 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                      {section.children.map((child, childIndex) => (
                        <li key={childIndex} className="py-1">
                          <Link
                            to={child.url}
                            className="text-gray-600 hover:text-[#0284c7] transition-colors flex items-center gap-2"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SitemapPage;

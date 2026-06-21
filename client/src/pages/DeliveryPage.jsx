import { Truck, CreditCard, Package, Clock, MapPin, Wallet, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const DeliveryPage = () => {
  const deliveryMethods = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Кур\'єрська доставка',
      description: 'Доставка до дверей вашого дому',
      price: 'Безкоштовно від 1000 ₴',
      time: '1-3 дні',
      features: [
        'Доставка до дверей',
        'Попередній дзвінок кур\'єра',
        'Можливість примірки',
        'Оплата при отриманні'
      ]
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Самовивіз з відділення',
      description: 'Нова Пошта, Укрпошта',
      price: 'За тарифами перевізника',
      time: '2-5 днів',
      features: [
        'Більше 10 000 відділень',
        'Зберігання 7 днів',
        'Повідомлення SMS',
        'Відстеження посилки'
      ]
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Самовивіз з магазину',
      description: 'З нашого офісу в Києві',
      price: 'Безкоштовно',
      time: 'В день замовлення',
      features: [
        'Готовність через 2 години',
        'Перевірка товару на місці',
        'Консультація фахівця',
        'Гарантія з моменту покупки'
      ]
    }
  ];

  const paymentMethods = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Готівковий розрахунок',
      description: 'Оплата при отриманні замовлення',
      details: 'Оплатіть товар готівкою кур\'єру або в відділенні при отриманні.'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Онлайн оплата',
      description: 'Банківською карткою Visa/Mastercard',
      details: 'Безпечна оплата через захищений платіжний шлюз. Моментальне підтвердження.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Оплата частинами',
      description: 'Розстрочка до 24 місяців',
      details: 'Оформіть розстрочку від ПриватБанку, МоноБанку або Ощадбанку без переплат.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#075985] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Доставка та оплата
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Обирайте зручний спосіб доставки та оплати. Ми пропонуємо кілька варіантів для вашої зручності.
          </p>
        </div>
      </section>

      {/* Delivery Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Способи доставки
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center text-white shadow-lg mb-6">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Вартість:</span>
                    <span className="font-semibold text-[#0284c7]">{method.price}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Термін:</span>
                    <span className="font-semibold text-[#0284c7]">{method.time}</span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {method.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Способи оплати
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg mb-6">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <p className="text-sm text-gray-500">{method.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Важлива інформація</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#0284c7] flex items-center justify-center text-white shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Обробка замовлень</h4>
                  <p className="text-sm text-gray-600">Замовлення обробляються протягом 24 годин у робочі дні.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#0284c7] flex items-center justify-center text-white shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Відстеження</h4>
                  <p className="text-sm text-gray-600">Після відправки ви отримаєте трек-номер для відстеження.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#0284c7] flex items-center justify-center text-white shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Безкоштовна доставка</h4>
                  <p className="text-sm text-gray-600">При замовленні від 1000 ₴ доставка кур'єром безкоштовна.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Маєте питання?</h2>
          <p className="text-gray-600 mb-8">Наша служба підтримки готова допомогти вам</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contacts">
              <Button className="bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:shadow-xl">
                Зв'язатися з нами
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                До каталогу
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveryPage;

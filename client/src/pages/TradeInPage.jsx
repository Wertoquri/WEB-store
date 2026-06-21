import { GitCompare, Smartphone, Laptop, DollarSign, CheckCircle, ArrowRight, Info, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const TradeInPage = () => {
  const [selectedDevice, setSelectedDevice] = useState({
    type: '',
    brand: '',
    model: '',
    condition: ''
  });

  const tradeInCategories = [
    {
      icon: <Smartphone className="w-10 h-10" />,
      title: 'Смартфони',
      description: 'Приймаємо смартфони будь-якого виробника',
      maxTrade: 'до 8 000 ₴',
      brands: ['Apple', 'Samsung', 'Xiaomi', 'Google', 'OnePlus', 'Huawei']
    },
    {
      icon: <Laptop className="w-10 h-10" />,
      title: 'Ноутбуки',
      description: 'Ноутбуки та ультрабуки в робочому стані',
      maxTrade: 'до 15 000 ₴',
      brands: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer']
    }
  ];

  const conditions = [
    {
      value: 'excellent',
      label: 'Відмінний',
      description: 'Без подряпин, повний комплект',
      multiplier: 0.8
    },
    {
      value: 'good',
      label: 'Хороший',
      description: 'Мінорні подряпини, працює без нарікань',
      multiplier: 0.6
    },
    {
      value: 'fair',
      label: 'Задовільний',
      description: 'Видимі пошкодження, але працює',
      multiplier: 0.4
    },
    {
      value: 'poor',
      label: 'Поганий',
      description: 'Серйозні пошкодження, потребує ремонту',
      multiplier: 0.2
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Оцініть пристрій',
      description: 'Оберіть категорію та вкажіть стан вашого пристрою'
    },
    {
      step: 2,
      title: 'Отримайте оцінку',
      description: 'Ми розрахуємо вартість трейд-ін онлайн'
    },
    {
      step: 3,
      title: 'Принесіть пристрій',
      description: 'Принесіть пристрій до нашого магазину для перевірки'
    },
    {
      step: 4,
      title: 'Оберіть новий товар',
      description: 'Вартість трейд-ін буде зарахована як знижка на новий товар'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Трейд-ін
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Здійте старий пристрій та отримайте знижку на новий. Швидко, просто та вигідно!
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Що можна здати?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tradeInCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg mb-6">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl mb-6">
                  <span className="text-gray-600">Максимальна знижка:</span>
                  <span className="font-bold text-teal-600 text-xl">{category.maxTrade}</span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-3">Приймаємо бренди:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.brands.map((brand, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Як це працює?
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Condition Guide */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Стан пристрою
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conditions.map((condition, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-teal-500 shadow-sm hover:shadow-lg transition-all">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                  condition.value === 'excellent' ? 'bg-green-100 text-green-600' :
                  condition.value === 'good' ? 'bg-blue-100 text-blue-600' :
                  condition.value === 'fair' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{condition.label}</h3>
                <p className="text-sm text-gray-600 mb-4">{condition.description}</p>
                <div className="p-3 bg-teal-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Оцінка:</p>
                  <p className="font-bold text-teal-600">{condition.multiplier * 100}% від ринкової</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Переваги трейд-ін</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Економія грошей</h3>
                  <p className="text-sm text-gray-600">Отримайте знижку до 50% на новий товар</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Екологічність</h3>
                  <p className="text-sm text-gray-600">Старі пристрої переробляються або відновлюються</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <GitCompare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Простий обмін</h3>
                  <p className="text-sm text-gray-600">Один візит до магазину — і у вас новий пристрій</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Безкоштовна оцінка</h3>
                  <p className="text-sm text-gray-600">Оцінка пристрою без зобов'язань покупки</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Готові до обміну?</h2>
          <p className="text-xl mb-8 text-white/90">Оберіть новий товар та отримайте знижку за трейд-ін</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button className="bg-white text-teal-600 hover:bg-gray-100 shadow-xl">
                До каталогу
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contacts" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border-2 border-white px-6 py-2 text-white hover:bg-white hover:text-teal-600 transition-all">
              Оцінити пристрій
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TradeInPage;

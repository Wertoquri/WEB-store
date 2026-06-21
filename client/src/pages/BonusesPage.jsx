import { Gift, Percent, Star, TrendingUp, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const BonusesPage = () => {
  const bonusInfo = [
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Реєстраційний бонус',
      value: '50 бонусів',
      description: 'Отримайте 50 бонусних балів одразу після реєстрації на сайті.',
      details: 'Бонуси нараховуються автоматично при створенні акаунту.'
    },
    {
      icon: <Percent className="w-8 h-8" />,
      title: 'Кешбек з покупок',
      value: 'До 10%',
      description: 'Отримуйте до 10% бонусами з кожної покупки.',
      details: 'Розмір кешбеку залежиться від категорії товару та вашого статусу.'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Бонус за відгук',
      value: '20 бонусів',
      description: 'Залиште відгук про товар та отримайте 20 бонусних балів.',
      details: 'Відгук має бути змістовним та містити мінімум 50 символів.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'День народження',
      value: '100 бонусів',
      description: 'Подвійні бонуси протягом тижня до та після дня народження.',
      details: 'Вкажіть дату народження в особистому кабінеті.'
    }
  ];

  const tiers = [
    {
      name: 'Базовий',
      color: 'from-gray-400 to-gray-500',
      textColor: 'text-gray-600',
      requirements: 'Реєстрація',
      cashback: '3%',
      perks: ['Реєстраційний бонус', 'Стандартний кешбек', 'Доступ до акцій']
    },
    {
      name: 'Срібний',
      color: 'from-gray-400 to-gray-500',
      textColor: 'text-gray-700',
      requirements: 'Від 5 000 ₴ покупок',
      cashback: '5%',
      perks: ['Підвищений кешбек', 'Пріоритетна підтримка', 'Ексклюзивні знижки', 'Бонус за відгук']
    },
    {
      name: 'Золотий',
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      requirements: 'Від 20 000 ₴ покупок',
      cashback: '10%',
      perks: ['Максимальний кешбек', 'Персональний менеджер', 'Розширена гарантія', 'Подвійні бонуси']
    }
  ];

  const faq = [
    {
      question: 'Що таке бонусні бали?',
      answer: 'Бонусні бали — це внутрішня валюта магазину, яку можна використовувати для оплати покупок. 1 бонус = 1 ₴.'
    },
    {
      question: 'Як використати бонуси?',
      answer: 'При оформленні замовлення оберіть опцію "Оплатити бонусами". Ви можете списати до 50% вартості замовлення бонусами.'
    },
    {
      question: 'Чи згорають бонуси?',
      answer: 'Бонусні бали дійсні протягом 12 місяців з моменту нарахування. Після цього вони автоматично списуються.'
    },
    {
      question: 'Коли нараховуються бонуси?',
      answer: 'Бонуси нараховуються після підтвердження доставки замовлення та успішного завершення операції.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Бонусна програма
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Заробляйте бонуси з кожної покупки та використовуйте їх для оплати наступних замовлень!
          </p>
        </div>
      </section>

      {/* Bonus Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Як заробити бонуси?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bonusInfo.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl mb-4">
                  <span className="text-sm text-gray-600">Бонус:</span>
                  <span className="font-bold text-purple-600">{item.value}</span>
                </div>

                <p className="text-gray-600 mb-4">{item.description}</p>
                <p className="text-sm text-gray-500">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Рівні програми лояльності
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`text-center mb-6`}>
                  <h3 className={`text-2xl font-bold mb-2 ${tier.textColor}`}>{tier.name}</h3>
                  <p className="text-sm text-gray-500">{tier.requirements}</p>
                </div>

                <div className="text-center mb-6">
                  <div className={`text-5xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
                    {tier.cashback}
                  </div>
                  <p className="text-gray-600">кешбек</p>
                </div>

                <ul className="space-y-3">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Часті запитання
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">?</span>
                  {item.question}
                </h3>
                <p className="text-gray-600 ml-11">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Почніть заробляти бонуси вже зараз!</h2>
          <p className="text-gray-600 mb-8">Зареєструйтесь та отримайте 50 бонусних балів</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-xl">
                Зареєструватися
                <Gift className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                До каталогу
                <ShoppingBag className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BonusesPage;

import { CreditCard, Percent, Calculator, Shield, CheckCircle, ArrowRight, Info, Wallet, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const CreditPage = () => {
  const installmentPlans = [
    {
      bank: 'ПриватБанк',
      logo: 'from-blue-500 to-blue-600',
      months: 'До 24 місяців',
      rate: '0%',
      description: '"Оплата частинами" від ПриватБанку',
      requirements: [
        'Картка ПриватБанку',
        'Ліміт на картці',
        'Підключення послуги'
      ],
      link: '#'
    },
    {
      bank: 'МоноБанк',
      logo: 'from-green-500 to-green-600',
      months: 'До 12 місяців',
      rate: '0%',
      description: '"Плати частинами" від МоноБанку',
      requirements: [
        'Картка МоноБанку',
        'Достатній ліміт',
        'Мобільний додаток'
      ],
      link: '#'
    },
    {
      bank: 'Ощадбанк',
      logo: 'from-teal-500 to-teal-600',
      months: 'До 18 місяців',
      rate: '0%',
      description: 'Розстрочка від Ощадбанку',
      requirements: [
        'Картка Ощадбанку',
        'Паспорт та ІПН',
        'Довідка про доходи'
      ],
      link: '#'
    }
  ];

  const benefits = [
    {
      icon: <Percent className="w-8 h-8" />,
      title: 'Без переплат',
      description: '0% річних на весь термін розстрочки. Ви платите тільки за товар.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Швидке оформлення',
      description: 'Оформлення розстрочки займає не більше 5 хвилин онлайн.'
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Гнучкі умови',
      description: 'Оберіть зручний термін виплат від 3 до 24 місяців.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Безпека',
      description: 'Всі операції захищені банківським рівнем шифрування.'
    }
  ];

  const steps = [
    {
      step: 1,
      title: 'Оберіть товар',
      description: 'Додайте товар до кошика та оберіть опцію "Розстрочка"'
    },
    {
      step: 2,
      title: 'Оберіть банк',
      description: 'Оберіть зручний банк для оформлення розстрочки'
    },
    {
      step: 3,
      title: 'Заповніть заявку',
      description: 'Введіть необхідні дані для перевірки банком'
    },
    {
      step: 4,
      title: 'Отримайте товар',
      description: 'Після схвалення оформіть замовлення та отримайте товар'
    }
  ];

  const faq = [
    {
      question: 'Хто може оформити розстрочку?',
      answer: 'Громадяни України віком від 18 років з діючою банківською карткою та достатнім кредитним лімітом.'
    },
    {
      question: 'Чи є комісія за розстрочку?',
      answer: 'Ні, розстрочка оформлюється під 0% річних. Ви платите тільки вартість товару, розділену на рівні частини.'
    },
    {
      question: 'Що станеться, якщо я не сплачу вчасно?',
      answer: 'При простроченні платежу банк може нарахувати пеню згідно з умовами договору. Рекомендуємо налаштувати автоплатіж.'
    },
    {
      question: 'Чи можна достроково погасити розстрочку?',
      answer: 'Так, ви можете повністю або частково погасити розстрочку достроково без додаткових комісій.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Розстрочка
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Купуйте техніку мрії вже зараз та платіть зручними частинами без переплат!
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Переваги розстрочки
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banks */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Банки-партнери
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {installmentPlans.map((plan, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.logo} flex items-center justify-center text-white shadow-lg mb-6`}>
                  <CreditCard className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.bank}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                    <span className="text-sm text-gray-600">Термін:</span>
                    <span className="font-bold text-indigo-600">{plan.months}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="text-sm text-gray-600">Ставка:</span>
                    <span className="font-bold text-green-600">{plan.rate}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Вимоги:</p>
                  <ul className="space-y-2">
                    {plan.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Як оформити розстрочку?
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4">
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

      {/* Calculator Example */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Calculator className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Приклад розрахунку</h2>
                <p className="text-gray-600">iPhone 15 Pro Max — 24 місяці розстрочки</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-500 mb-2">Вартість товару</p>
                <p className="text-3xl font-bold text-gray-900">$1 200</p>
              </div>
              <div className="text-center p-6 bg-indigo-50 rounded-2xl">
                <p className="text-sm text-gray-500 mb-2">Щомісячний платіж</p>
                <p className="text-3xl font-bold text-indigo-600">$50</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <p className="text-sm text-gray-500 mb-2">Переплата</p>
                <p className="text-3xl font-bold text-green-600">$0</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Це лише приклад. Фактичні умови можуть відрізнятися залежно від банку та вашої кредитної історії.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Часті запитання
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Купуйте зараз — платіть частинами!</h2>
          <p className="text-xl mb-8 text-white/90">Оберіть товар та оформіть розстрочку за 5 хвилин</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl">
                До каталогу
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contacts" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border-2 border-white px-6 py-2 text-white hover:bg-white hover:text-indigo-600 transition-all">
              Консультація
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreditPage;

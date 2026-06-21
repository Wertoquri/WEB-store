import { Shield, ArrowLeftRight, FileText, CheckCircle, Phone, Mail, AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const WarrantyPage = () => {
  const warrantyInfo = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Офіційна гарантія',
      duration: '12-24 місяці',
      description: 'На всю техніку поширюється офіційна гарантія виробника. Термін гарантії залежить від категорії товару.',
      features: [
        'Смартфони та планшети — 12 місяців',
        'Ноутбуки та комп\'ютери — 24 місяці',
        'Аудіотехніка — 12 місяців',
        'Годинники та фітнес-браслети — 12 місяців'
      ]
    },
    {
      icon: <ArrowLeftRight className="w-8 h-8" />,
      title: 'Повернення товару',
      duration: '14 днів',
      description: 'Ви можете повернути товар протягом 14 днів з моменту покупки, якщо він не був у використанні.',
      features: [
        'Товар не використовувався',
        'Збережено товарний вигляд',
        'Є товарний чек',
        'Цілісне пакування'
      ]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Гарантійний ремонт',
      duration: 'До 30 днів',
      description: 'У разі поломки під час гарантійного терміну ми здійснюємо безкоштовний ремонт або заміну товару.',
      features: [
        'Безкоштовна діагностика',
        'Ремонт в авторизованому сервісі',
        'Підмінний товар на час ремонту',
        'Продовження гарантії після ремонту'
      ]
    }
  ];

  const returnSteps = [
    {
      step: 1,
      title: 'Зверніться до підтримки',
      description: 'Зв\'яжіться з нами по телефону, email або через форму на сайті'
    },
    {
      step: 2,
      title: 'Опишіть проблему',
      description: 'Надайте номер замовлення та опишіть причину повернення'
    },
    {
      step: 3,
      title: 'Отримайте інструкції',
      description: 'Ми надішлемо інструкції щодо повернення та адресу'
    },
    {
      step: 4,
      title: 'Відправте товар',
      description: 'Упакуйте товар та відправте за вказаною адресою'
    },
    {
      step: 5,
      title: 'Отримайте кошти',
      description: 'Після перевірки кошти будуть повернені протягом 7-14 днів'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Гарантія та повернення
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Ми гарантуємо якість наших товарів та готові допомогти з поверненням, якщо щось пішло не так.
          </p>
        </div>
      </section>

      {/* Warranty Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Гарантійні зобов'язання
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warrantyInfo.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl mb-4">
                  <span className="text-sm text-gray-600">Термін:</span>
                  <span className="font-semibold text-green-600">{item.duration}</span>
                </div>

                <p className="text-gray-600 mb-4">{item.description}</p>

                <ul className="space-y-2">
                  {item.features.map((feature, i) => (
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

      {/* Return Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
            Як повернути товар?
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {returnSteps.map((step, index) => (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                    {index < returnSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notices */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Не підлягає поверненню</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span className="text-sm text-gray-700">Товари особистої гігієни</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span className="text-sm text-gray-700">Програмне забезпечення після активації</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span className="text-sm text-gray-700">Товари зі слідами використання</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span className="text-sm text-gray-700">Товари без упаковки</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Корисна інформація</h3>
                  <p className="text-gray-600 mb-4">
                    При отриманні товару обов'язково перевірте його комплектацію та зовнішній вигляд. 
                    У разі виявлення пошкоджень одразу повідомте кур'єра.
                  </p>
                  <p className="text-gray-600">
                    Повернення коштів здійснюється на картку або банківський рахунок протягом 7-14 робочих днів.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Потрібна допомога?</h2>
          <p className="text-gray-600 mb-8">Наша служба підтримки допоможе з будь-якими питаннями</p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
              <Phone className="w-6 h-6 text-[#0284c7]" />
              <div className="text-left">
                <p className="text-sm text-gray-500">Телефон</p>
                <p className="font-bold text-gray-900">+380 (44) 123-45-67</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
              <Mail className="w-6 h-6 text-[#0284c7]" />
              <div className="text-left">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-bold text-gray-900">support@webstore.com</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contacts">
              <Button className="bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:shadow-xl">
                Написати нам
                <Mail className="ml-2 w-4 h-4" />
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

export default WarrantyPage;

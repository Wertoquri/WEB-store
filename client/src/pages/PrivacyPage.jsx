import { Shield } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#075985] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-10 h-10" />
            <h1 className="text-4xl font-bold tracking-tight">Політика конфіденційності</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">
            Останнє оновлення: Квітень 2026 року
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Загальні положення</h2>
              <p className="text-gray-600 leading-relaxed">
                Ця Політика конфіденційності визначає порядок збору, використання та зберігання персональних даних
                користувачів інтернет-магазину WebStore (далі — «Сайт», «Ми»). Ми поважаємо вашу конфіденційність
                та прагнемо захистити ваші персональні дані відповідно до Закону України «Про захист персональних даних»
                та Загального регламенту захисту даних ЄС (GDPR).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Які дані ми збираємо</h2>
              <p className="text-gray-600 leading-relaxed mb-3">Ми можемо збирати наступні категорії даних:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li><strong>Контактна інформація:</strong> ім'я, прізвище, email, номер телефону</li>
                <li><strong>Адреса доставки:</strong> вулиця, місто, індекс</li>
                <li><strong>Дані про замовлення:</strong> історія покупок, товари в кошику</li>
                <li><strong>Технічні дані:</strong> IP-адреса, тип браузера, файли cookie</li>
                <li><strong>Платіжна інформація:</strong> дані про транзакції (ми не зберігаємо дані карток)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Мета обробки даних</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Обробка та доставка замовлень</li>
                <li>Підтримка зв'язку з клієнтами</li>
                <li>Покращення якості обслуговування</li>
                <li>Надсилання інформації про акції та новинки (за згодою)</li>
                <li>Виконання вимог законодавства</li>
                <li>Запобігання шахрайству</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Захист даних</h2>
              <p className="text-gray-600 leading-relaxed">
                Ми застосовуємо сучасні технічні та організаційні заходи для захисту ваших персональних даних:
                шифрування (HTTPS/TLS), захист паролів методом bcrypt, обмежений доступ до даних співробітниками,
                регулярні перевірки безпеки.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Передача даних третім особам</h2>
              <p className="text-gray-600 leading-relaxed">
                Ми не продаємо та не передаємо ваші персональні дані третім особам для маркетингових цілей.
                Дані можуть бути передані лише:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-3">
                <li>Службам доставки для виконання замовлень</li>
                <li>Платіжним системам для обробки платежів</li>
                <li>Державним органам за вимогою закону</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Права користувачів</h2>
              <p className="text-gray-600 leading-relaxed mb-3">Ви маєте право:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Отримати копію ваших персональних даних</li>
                <li>Виправити неточні дані</li>
                <li>Вимагати видалення даних («право на забуття»)</li>
                <li>Відкликати згоду на обробку даних</li>
                <li>Заперечувати проти обробки даних для маркетингу</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Файли Cookie</h2>
              <p className="text-gray-600 leading-relaxed">
                Сайт використовує файли cookie для забезпечення функціональності, аналітики та персоналізації.
                Ви можете керувати налаштуваннями cookie у вашому браузері.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Контакти</h2>
              <p className="text-gray-600 leading-relaxed">
                З будь-яких питань щодо конфіденційності звертайтесь:
                <br />
                <strong>Email:</strong> privacy@webstore.com
                <br />
                <strong>Телефон:</strong> +380 (44) 123-45-67
                <br />
                <strong>Адреса:</strong> м. Київ, вул. Хрещатик, 1
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;

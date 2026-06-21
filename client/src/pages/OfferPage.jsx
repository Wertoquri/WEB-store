import { FileText } from 'lucide-react';

const OfferPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#075985] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-4xl font-bold tracking-tight">Публічна оферта</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">
            Договір купівлі-продажу товарів дистанційним способом
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Визначення</h2>
              <p className="text-gray-600 leading-relaxed">
                <strong>Продавець</strong> — інтернет-магазин WebStore, зареєстрований відповідно до законодавства України.
                <br /><br />
                <strong>Покупець</strong> — будь-яка фізична або юридична особа, яка оформлює замовлення на Сайті.
                <br /><br />
                <strong>Оферта</strong> — цей документ, опублікований на Сайті, є публічною пропозицією укласти договір
                купівлі-продажу товарів дистанційним способом на умовах, визначених у цьому документі.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Предмет договору</h2>
              <p className="text-gray-600 leading-relaxed">
                Продавець зобов'язується передати Покупцеві товари, а Покупець зобов'язується прийняти та оплатити
                замовлені товари на умовах цієї Оферти. Асортимент, ціна та кількість товарів визначаються Покупцем
                самостійно при оформленні замовлення на Сайті.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Оформлення замовлення</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Замовлення оформляється шляхом додавання товарів до кошика та заповнення форми замовлення, яка містить:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>ПІБ одержувача</li>
                <li>Контактний телефон</li>
                <li>Email</li>
                <li>Адресу доставки</li>
                <li>Спосіб оплати</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                Оформлення замовлення означає повне прийняття Покупцем умов цієї Оферти.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ціна та оплата</h2>
              <p className="text-gray-600 leading-relaxed">
                Ціна товарів вказана у гривнях (₴) або доларах США ($) на Сайті. Продавець має право змінювати ціни
                без попереднього повідомлення Покупця. Зміна ціни не впливає на вже оформлені замовлення.
              </p>
              <p className="text-gray-600 leading-relaxed mt-3">
                <strong>Доступні способи оплати:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-2">
                <li>Банківською карткою онлайн</li>
                <li>Готівкою при отриманні</li>
                <li>Google Pay / Apple Pay</li>
                <li>Безготівковий розрахунок для юридичних осіб</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Доставка</h2>
              <p className="text-gray-600 leading-relaxed">
                Доставка здійснюється по всій території України службами доставки: Нова Пошта, Укрпошта, кур'єрська
                доставка по Києву. Терміни доставки: 1-5 робочих днів залежно від регіону. Безкоштовна доставка
                при замовленні від 1000 ₴.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Повернення товару</h2>
              <p className="text-gray-600 leading-relaxed">
                Покупець має право повернути товар протягом 14 днів з моменту отримання, якщо товар не був у
                використанні, збережено його товарний вигляд, споживчі властивості та цілісність пакування.
                Повернення коштів здійснюється протягом 7-14 робочих днів.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Відповідальність сторін</h2>
              <p className="text-gray-600 leading-relaxed">
                Продавець не несе відповідальності за некоректну роботу Сайту, якщо це викликано обставинами
                непереборної сили. Продавець гарантує відповідність товарів опису на Сайті та наявність
                офіційної гарантії виробника.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Реквізити Продавця</h2>
              <div className="bg-gray-50 rounded-xl p-6 text-gray-700 space-y-1">
                <p><strong>Назва:</strong> ТОВ «WebStore»</p>
                <p><strong>ЄДРПОУ:</strong> 12345678</p>
                <p><strong>Адреса:</strong> 01001, м. Київ, вул. Хрещатик, 1</p>
                <p><strong>Телефон:</strong> +380 (44) 123-45-67</p>
                <p><strong>Email:</strong> info@webstore.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfferPage;

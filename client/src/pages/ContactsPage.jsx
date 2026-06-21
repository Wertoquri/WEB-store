import { useState } from 'react';
import { BadgeCheck, Bird, Camera, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { Button } from '../components/ui/button';

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Повідомлення успішно відправлено.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch {
      setError('Не вдалося відправити повідомлення. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#075985] py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Контакти</h1>
          <p className="max-w-2xl text-xl text-white/90">
            Якщо потрібна допомога з вибором товару, доставкою або оформленням замовлення, напишіть нам у зручний для вас спосіб.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="transform rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white shadow-lg">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">Телефон</h3>
              <p className="mb-2 text-2xl font-bold text-[#0284c7]">+380 (44) 123-45-67</p>
              <p className="text-sm text-gray-500">Дзвінки в межах України</p>
            </div>

            <div className="transform rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">Email</h3>
              <p className="mb-2 text-lg font-bold text-green-600">info@webstore.com</p>
              <p className="text-sm text-gray-500">Відповідаємо протягом одного робочого дня</p>
            </div>

            <div className="transform rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">Адреса</h3>
              <p className="mb-1 text-gray-700">м. Київ</p>
              <p className="text-sm text-gray-500">вул. Хрещатик, 1</p>
            </div>

            <div className="transform rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">Графік роботи</h3>
              <p className="mb-1 text-gray-700">Пн-Пт: 9:00 - 20:00</p>
              <p className="text-sm text-gray-500">Сб-Нд: 10:00 - 18:00</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Написати нам</h2>

              {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

              {success && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">{success}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Ваше ім'я *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Іван Петренко"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+380XXXXXXXXX"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Тема *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Тема звернення"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Повідомлення *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Коротко опишіть ваше питання або замовлення..."
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] py-3 hover:shadow-xl"
                >
                  {loading ? 'Відправляємо...' : 'Відправити повідомлення'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="flex h-80 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <MapPin className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p className="font-medium text-gray-500">м. Київ, вул. Хрещатик, 1</p>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg">
                <h3 className="mb-6 text-xl font-bold text-gray-900">Месенджери</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="viber://chat?number=%2B380441234567"
                    className="flex items-center justify-center gap-3 rounded-2xl bg-green-50 p-4 transition-all hover:bg-green-100"
                  >
                    <MessageCircle className="h-6 w-6 text-green-600" />
                    <span className="font-medium text-gray-900">Viber</span>
                  </a>
                  <a
                    href="https://t.me/webstore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 rounded-2xl bg-blue-50 p-4 transition-all hover:bg-blue-100"
                  >
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                    <span className="font-medium text-gray-900">Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Ми в соціальних мережах</h2>
          <p className="mb-8 text-gray-600">Підписуйтеся, щоб першими дізнаватися про новинки, знижки та корисні добірки товарів.</p>

          <div className="flex justify-center gap-6">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-md transition-all hover:scale-110 hover:shadow-xl"
            >
              <BadgeCheck className="h-8 w-8" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-pink-600 shadow-md transition-all hover:scale-110 hover:shadow-xl"
            >
              <Camera className="h-8 w-8" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-sky-500 shadow-md transition-all hover:scale-110 hover:shadow-xl"
            >
              <Bird className="h-8 w-8" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactsPage;

# WebStore

**Full-stack портфоліо-проєкт інтернет-магазину з адаптивною вітриною, постійним зберіганням даних, керуванням товарами, відгуками та замовленнями.**

[Онлайн-демо](https://webstore-portfolio.onrender.com/) · [Стан API](https://webstore-portfolio.onrender.com/api/health) · [English version](README.md)

> Це демонстраційний проєкт. Реальні платежі, служби доставки й транзакційні email-повідомлення не підключені.

## Про проєкт

WebStore демонструє повний шлях покупця: перегляд і фільтрацію товарів, сторінку товару, створення облікового запису, wishlist, кошик, оформлення замовлення та перегляд історії покупок. Адміністратор може керувати каталогом, замовленнями й відповідями на відгуки.

React-застосунок і Express API розгортаються як один сервіс. PostgreSQL зберігає дані застосунку, а Cloudinary забезпечує постійне зберігання медіафайлів.

## Демо-вхід

| Роль | Email | Пароль |
| --- | --- | --- |
| Покупець | `user@example.com` | `PortfolioDemo2026!` |

Пароль адміністратора генерується приватно під час deployment і навмисно не публікується.

Безкоштовному Render-сервісу після періоду бездіяльності може знадобитися до хвилини для запуску.

## Можливості

### Вітрина

- Адаптивний каталог із пошуком, фільтрами, сортуванням і пагінацією
- Сторінки товарів із залишками, кольорами, рейтингом і медіа
- Wishlist і кошик зі зберіганням на сервері
- Оформлення замовлення та особиста історія покупок
- Профіль і керування даними користувача
- Рейтинги й відгуки із зображеннями або відео
- Сторінки доставки, гарантії, акцій, кредиту та trade-in

### Адміністрування

- Адміністративні маршрути із перевіркою ролі
- Створення, редагування й видалення товарів, завантаження зображень
- Перегляд замовлень і зміна їхніх статусів
- Відповіді адміністратора на відгуки покупців

### Платформа

- Реєстрація та вхід через email/пароль із JWT і bcrypt
- Опційна інтеграція Google OAuth
- PostgreSQL-модель даних через Prisma ORM
- Постійне зберігання завантажень у Cloudinary
- Lazy-loaded React-маршрути
- Видача frontend і API з одного production-домену
- Демо-каталог і тестові облікові записи
- Render health check за адресою `/api/health`

## Архітектура

```text
Браузер
  └── React + Vite
       └── /api
            └── Express + JWT + Prisma
                 ├── PostgreSQL (Neon)
                 └── Cloudinary для медіафайлів
```

У production Express видає зібраний React-застосунок і REST API з одного домену. Клієнту достатньо відкрити одне посилання — нічого встановлювати локально не потрібно.

## Технології

| Частина | Технології |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios, Framer Motion, Tailwind CSS, Sass, Radix UI |
| Backend | Node.js 22, Express, Prisma, JWT, bcrypt, Multer |
| Дані | PostgreSQL, Neon |
| Медіа | Cloudinary |
| Deployment | Render Blueprint |
| Перевірки | Node test runner, Supertest, Vite build, npm audit |

## Структура репозиторію

```text
WEB-store/
├── client/                 React-вітрина
│   ├── src/components/     Спільні UI-компоненти
│   ├── src/context/        Стан авторизації, кошика й wishlist
│   ├── src/pages/          Сторінки маршрутів
│   └── src/services/       API-клієнт
├── server/
│   ├── prisma/             Схема та відтворюваний demo seed
│   ├── src/controllers/    Бізнес-логіка API
│   ├── src/middleware/     Авторизація, uploads і безпека
│   ├── src/routes/         REST-маршрути
│   └── test/               Smoke-тести API
├── render.yaml             Production Blueprint
└── package.json            Спільні команди
```

## Локальний запуск

### Вимоги

- Node.js 22+
- PostgreSQL-база
- Cloudinary лише якщо потрібне постійне зберігання завантажених медіа

### 1. Встановлення залежностей

```bash
git clone https://github.com/Wertoquri/WEB-store.git
cd WEB-store
npm run install:all
```

### 2. Налаштування API

Скопіюйте `server/.env.example` у `server/.env` та вкажіть щонайменше:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/webstore?schema=public
JWT_SECRET=replace-with-a-secret-of-at-least-32-characters
CLIENT_URL=http://localhost:3001
```

Опційні інтеграції:

```env
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
GOOGLE_CLIENT_ID=
DEMO_ADMIN_PASSWORD=
DEMO_USER_PASSWORD=
```

Для Google Sign-In у Vite-клієнті додайте `VITE_GOOGLE_CLIENT_ID` у `client/.env`.

### 3. Підготовка бази

```bash
npm run prisma:generate --prefix server
npm run prisma:deploy --prefix server
npm run prisma:seed --prefix server
```

Seed-команда заново створює демонстраційний каталог і тестові акаунти. Не запускайте її для бази з даними, які потрібно зберегти.

### 4. Запуск застосунків

Термінал 1:

```bash
npm run dev --prefix server
```

Термінал 2:

```bash
npm run dev --prefix client
```

- Frontend: <http://localhost:3001>
- Стан API: <http://localhost:5000/api/health>

## Перевірка

Запустіть повний локальний pipeline:

```bash
npm run verify
```

Команда запускає API-тести, production-збірку клієнта та аудит production-залежностей обох застосунків.

## Безкоштовний deployment

Файл [`render.yaml`](render.yaml) розгортає проєкт як один Render Web Service.

1. Створіть PostgreSQL-базу в Neon.
2. Створіть Cloudinary account для постійного зберігання uploads.
3. Створіть Render Blueprint із цього репозиторію.
4. Додайте `DATABASE_URL` і `CLOUDINARY_URL`, коли Render їх запросить.
5. Дозвольте Render згенерувати `JWT_SECRET` і приватний пароль адміністратора.
6. Перевірте вітрину й `/api/health`.

Production-команди:

```bash
npm run render:build
npm run render:start
```

## Безпека

- Секрети передаються через environment variables і не зберігаються в Git.
- Production вимагає JWT secret довжиною щонайменше 32 символи.
- Паролі хешуються через bcrypt.
- Захищені й адміністративні маршрути перевіряються на API.
- Uploads мають обмеження типу, розміру та кількості файлів.
- Production-помилки не розкривають внутрішні stack traces.

## Обмеження демо

- Checkout не списує кошти з реального платіжного методу.
- Служби доставки й транзакційні email-повідомлення не підключені.
- Google OAuth вимагає окремих credentials і дозволеного production origin.
- Безкоштовний hosting має квоти й cold start.
- Render start-команда повторно заповнює demo-базу, тому цей deployment не призначений для зберігання реальних замовлень.

## Ліцензія

Проєкт поширюється за умовами [MIT License](LICENSE).

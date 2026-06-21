# WebStore

Повноцінний демонстраційний інтернет-магазин: каталог, пошук, кошик, wishlist, оформлення замовлень, профіль користувача, відгуки та адміністративна панель.

> Portfolio project. Реальні платежі та доставка не підключені.

## Що демонструє проєкт

- JWT-авторизацію та розмежування ролей;
- каталог із серверною пагінацією, фільтрами, сортуванням і пошуком;
- серверний кошик, wishlist та історію замовлень;
- керування товарами й статусами замовлень;
- рейтинги, відгуки та відповіді адміністратора;
- Google OAuth як опціональну інтеграцію;
- PostgreSQL через Prisma ORM;
- постійне зберігання медіа у Cloudinary;
- адаптивний React-інтерфейс із lazy-loaded сторінками;
- production deployment одним Node.js-сервісом.

## Архітектура

```text
Browser
  └─ React + Vite
       └─ /api
            └─ Express + JWT + Prisma
                 ├─ PostgreSQL (Neon)
                 └─ Cloudinary media storage
```

У production Express віддає зібраний React-клієнт та API з одного домену. Клієнту потрібне лише одне посилання, а основний сценарій не залежить від cross-origin запитів.

## Технології

**Frontend:** React 18, React Router, Axios, Framer Motion, Tailwind CSS, Sass, Radix UI.

**Backend:** Node.js, Express, Prisma, PostgreSQL, JWT, bcrypt, Multer, Cloudinary.

## Локальний запуск

Потрібні Node.js 22+ і PostgreSQL.

```bash
git clone https://github.com/Wertoquri/WEB-store.git
cd WEB-store
npm run install:all
```

Створіть `server/.env` на основі `server/.env.example`, потім:

```bash
npm run prisma:generate --prefix server
npm run prisma:deploy --prefix server
npm run prisma:seed --prefix server
npm run dev --prefix server
npm run dev --prefix client
```

Frontend: `http://localhost:3001`  
API health: `http://localhost:5000/api/health`

## Production

```bash
npm run render:build
npm run render:start
```

Обов'язкові змінні середовища:

```env
DATABASE_URL=
JWT_SECRET=
DEMO_ADMIN_PASSWORD=
DEMO_USER_PASSWORD=
CLOUDINARY_URL=
NODE_ENV=production
```

`GOOGLE_CLIENT_ID` потрібен лише для Google OAuth.

## Безкоштовний deployment

1. Створіть PostgreSQL-базу в Neon і скопіюйте connection string у `DATABASE_URL`.
2. Створіть Cloudinary account і скопіюйте `CLOUDINARY_URL`.
3. Завантажте репозиторій на GitHub.
4. Створіть Render Blueprint із репозиторію — конфігурація знаходиться в `render.yaml`.
5. Заповніть секретні environment variables та запустіть deploy.
6. Перевірте `/api/health`, реєстрацію, каталог, кошик і створення замовлення.

Публічний demo-вхід: `user@example.com` / `PortfolioDemo2026!`. Пароль
адміністратора Render генерує приватно; він не зберігається в репозиторії.

Безкоштовний Render Web Service засинає після періоду бездіяльності, тому перше відкриття може тривати близько хвилини. Це прийнятно для портфоліо, але не для реального магазину.

## Безпека

- секрети не зберігаються в Git;
- production вимагає `JWT_SECRET` довжиною щонайменше 32 символи;
- паролі хешуються через bcrypt;
- upload має обмеження типів, кількості та розміру файлів;
- production-помилки не повертають внутрішні stack traces;
- доступ до admin routes перевіряється на backend.

## Перевірки

```bash
npm run build --prefix client
npm audit --omit=dev --prefix client
npm audit --omit=dev --prefix server
node --check server/src/index.js
```

## Обмеження демо

- немає реального приймання платежів;
- email та OAuth потребують окремих credentials;
- безкоштовні hosting/database плани мають квоти й cold start;
- адміністративний пароль не слід публікувати в README.

## License

MIT

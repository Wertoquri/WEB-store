import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  {
    title: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    description: 'Найпотужніший iPhone з титановим корпусом, чіпом A17 Pro та професійною камерою 48MP',
    price: 1499.99,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603921314668-3aeda1b229a2?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Natural Titanium', hex: '#8B8681' },
      { name: 'Blue Titanium', hex: '#3B4A5F' },
      { name: 'White Titanium', hex: '#F0EDE8' },
      { name: 'Black Titanium', hex: '#2C2C2E' }
    ]),
    category: 'Smartphones',
    stock: 25,
    rating: 4.9,
    reviews: 127
  },
  {
    title: 'MacBook Pro 16" M3 Max Space Black',
    description: 'Професійний ноутбук з чіпом M3 Max, 36GB RAM, 1TB SSD. Найпродуктивніший MacBook',
    price: 3499.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Space Black', hex: '#1C1C1E' },
      { name: 'Silver', hex: '#E3E4E5' }
    ]),
    category: 'Laptops',
    stock: 15,
    rating: 4.8,
    reviews: 89
  },
  {
    title: 'Sony WH-1000XM5 Wireless Headphones Black',
    description: 'Флагманські бездротові навушники з найкращим шумоподавленням на ринку',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Black', hex: '#1C1C1E' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Midnight Blue', hex: '#1B2A4A' }
    ]),
    category: 'Audio',
    stock: 50,
    rating: 4.7,
    reviews: 234
  },
  {
    title: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    description: 'Розумний смартфон з AI, S Pen, камерою 200MP та титановою рамкою',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Titanium Gray', hex: '#6B6B6B' },
      { name: 'Titanium Black', hex: '#1C1C1E' },
      { name: 'Titanium Violet', hex: '#6B5B73' },
      { name: 'Titanium Yellow', hex: '#E8D5A3' }
    ]),
    category: 'Smartphones',
    stock: 30,
    rating: 4.8,
    reviews: 156
  },
  {
    title: 'Apple Watch Series 9 GPS + Cellular 45mm',
    description: 'Розумний годинник з датчиками здоровʼя, Always-On дисплеєм та швидким чіпом S9',
    price: 529.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Midnight', hex: '#1C1C1E' },
      { name: 'Starlight', hex: '#F0E6D3' },
      { name: 'Silver', hex: '#E3E4E5' },
      { name: 'Product Red', hex: '#C9002B' }
    ]),
    category: 'Wearables',
    stock: 40,
    rating: 4.6,
    reviews: 98
  },
  {
    title: 'iPad Pro 12.9" M2 WiFi 256GB Space Gray',
    description: 'Планшет з дисплеєм Liquid Retina XDR, чіпом M2 та підтримкою Apple Pencil',
    price: 1099.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1532555138845-352988621245?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Space Gray', hex: '#2C2C2E' },
      { name: 'Silver', hex: '#E3E4E5' }
    ]),
    category: 'Tablets',
    stock: 20,
    rating: 4.9,
    reviews: 67
  },
  {
    title: 'Dell XPS 15 OLED Intel i9 32GB RAM',
    description: 'Преміальний ноутбук з OLED дисплеєм 3.5K, потужною продуктивністю та стильним дизайном',
    price: 2799.99,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Platinum Silver', hex: '#C0C0C0' },
      { name: 'Graphite', hex: '#383838' }
    ]),
    category: 'Laptops',
    stock: 12,
    rating: 4.7,
    reviews: 45
  },
  {
    title: 'AirPods Pro 2nd Gen with MagSafe USB-C',
    description: 'Бездротові навушники з активним шумоподавленням та просторовим звуком',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1588423771092-78e79e80600d?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'White', hex: '#F5F5F7' }
    ]),
    category: 'Audio',
    stock: 100,
    rating: 4.8,
    reviews: 312
  },
  {
    title: 'PlayStation 5 Slim Digital Edition',
    description: 'Ігрова консоль нового покоління з підтримкою 4K, трасуванням променів та SSD',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'White', hex: '#F5F5F7' },
      { name: 'Black', hex: '#1C1C1E' }
    ]),
    category: 'Gaming',
    stock: 8,
    rating: 4.9,
    reviews: 445
  },
  {
    title: 'Canon EOS R6 Mark II Body',
    description: 'Повнокадрова бездзеркальна камера з 24.2MP, 4K 60fps відео та стабілізацією',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Black', hex: '#1C1C1E' }
    ]),
    category: 'Cameras',
    stock: 6,
    rating: 4.8,
    reviews: 34
  },
  {
    title: 'LG OLED C3 65" 4K Smart TV',
    description: 'OLED телевізор з процесором α9 Gen6, Dolby Vision IQ та gaming режимами 120Hz',
    price: 1799.99,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Black', hex: '#1C1C1E' }
    ]),
    category: 'TVs',
    stock: 5,
    rating: 4.7,
    reviews: 78
  },
  {
    title: 'Dyson V15 Detect Absolute Cordless',
    description: 'Бездротовий пилосос з лазерною підсвіткою та автоматичним регулюванням потужності',
    price: 749.99,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1527515545081-5db817172677?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Gold/Nickel', hex: '#C9A96E' },
      { name: 'Blue', hex: '#1E3A5F' }
    ]),
    category: 'Home',
    stock: 18,
    rating: 4.6,
    reviews: 156
  },
  {
    title: 'Nintendo Switch OLED Model White',
    description: 'Портативна консоль з 7" OLED екраном, покращеним звуком та 64GB памʼяті',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'White', hex: '#F5F5F7' },
      { name: 'Neon Red/Blue', hex: '#FF3B30' }
    ]),
    category: 'Gaming',
    stock: 35,
    rating: 4.8,
    reviews: 267
  },
  {
    title: 'Bose QuietComfort Ultra Earbuds',
    description: 'Навушники з найкращим шумоподавленням та імерсивним звуком',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Black', hex: '#1C1C1E' },
      { name: 'White Smoke', hex: '#E8E6E3' },
      { name: 'Moonstone Blue', hex: '#6B8E9B' }
    ]),
    category: 'Audio',
    stock: 45,
    rating: 4.5,
    reviews: 89
  },
  {
    title: 'GoPro HERO12 Black Creator Edition',
    description: 'Екшн-камера з 5.3K відео, гіростабілізацією та водонепроникністю до 10м',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop'
    ]),
    colors: JSON.stringify([
      { name: 'Black', hex: '#1C1C1E' }
    ]),
    category: 'Cameras',
    stock: 22,
    rating: 4.7,
    reviews: 112
  }
];

async function main() {
  console.log('Seeding database...');

  const existingProducts = await prisma.product.count();
  if (existingProducts > 0 && process.env.SEED_FORCE !== 'true') {
    console.log(`Seed skipped: database already contains ${existingProducts} products.`);
    return;
  }

  // Delete existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.wishlistProduct.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash passwords
  const adminPassword = await bcrypt.hash(
    process.env.DEMO_ADMIN_PASSWORD || 'change-this-admin-password',
    10
  );
  const userPassword = await bcrypt.hash(
    process.env.DEMO_USER_PASSWORD || 'DemoUser123!',
    10
  );

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@webstore.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    }
  });

  // Create demo user
  await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'user'
    }
  });

  console.log('Users created/updated!');

  // Create messages for the test user
  const testUser = await prisma.user.findUnique({ where: { email: 'user@example.com' } });
  if (testUser) {
    await prisma.message.createMany({
      data: [
        {
          userId: testUser.id,
          from: 'WebStore',
          subject: 'Ваше замовлення відправлено!',
          body: 'Дякуємо за замовлення! Ваше замовлення вже в дорозі і буде доставлено протягом 1-3 робочих днів. Трек-номер: NP-123456789',
          isRead: false,
        },
        {
          userId: testUser.id,
          from: 'WebStore Підтримка',
          subject: 'Дякуємо за ваш відгук!',
          body: 'Ми раді, що вам сподобався наш сервіс. Ваша думка допомагає нам ставати кращими. Бажаємо вам гарного дня!',
          isRead: true,
        },
        {
          userId: testUser.id,
          from: 'WebStore Акції',
          subject: '🔥 Весняний розпродаж — знижки до 50%!',
          body: 'Шановний клієнте! Запрошуємо вас скористатися нашими весняними знижками. Акція діє до кінця місяця. Не пропустіть!',
          isRead: false,
        },
      ]
    });
    console.log('Messages created for test user!');
  }

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log(`Seeding completed! ${products.length} products created.`);
  console.log('Demo accounts created. Passwords are configured through environment variables.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

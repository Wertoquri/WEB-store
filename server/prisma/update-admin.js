import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Make admin user
  await prisma.user.update({
    where: { email: 'user@example.com' },
    data: { role: 'admin' }
  });

  console.log('user@example.com is now an admin!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

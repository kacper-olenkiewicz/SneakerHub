require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@sneakerhub.com' }
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Create admin user with hashed password
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@sneakerhub.com',
      passwordHash: '$2b$10$gaqisu9xsErBJ6AnMAUhEuHUCj/Dys4S1qCzm2tuwue9oFSriO6KG', // bcrypt hash of 'admin'
    }
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

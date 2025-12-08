import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const ADMIN_PASSWORD_HASH = '$2b$10$KbSx8jGcexxmEujhTpiJXO1XnEjFwF2fWl1jloylTm30E83ooWrKe';

const seedUsers = [
  {
    name: 'Admin',
    email: 'admin@sneakerhub.com',
    passwordHash: ADMIN_PASSWORD_HASH,
    role: 'WORKER'
  },
  {
    name: 'Worker Admin',
    email: 'admin@wp.pl',
    passwordHash: ADMIN_PASSWORD_HASH,
    role: 'WORKER'
  }
];

export async function POST() {
  try {
    const results = [];

    for (const userData of seedUsers) {
      const existing = await prisma.user.findUnique({ where: { email: userData.email } });

      if (existing) {
        results.push({ email: userData.email, status: 'already-exists' });
        continue;
      }

      const created = await prisma.user.create({ data: userData });
      results.push({ email: created.email, status: 'created' });
    }

    return NextResponse.json(
      {
        message: 'Seed complete',
        results
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin users', details: error.message },
      { status: 500 }
    );
  }
}

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding counselor...');

  // 1. Create a User for the Counselor
  const counselorUser = await prisma.user.upsert({
    where: { email: 'ananya@pathfindr.com' },
    update: {},
    create: {
      email: 'ananya@pathfindr.com',
      passwordHash: 'password123', // In real app, hash this
      name: 'Dr. Ananya Sharma',
      role: 'COUNSELOR',
      avatarUrl: 'https://i.pravatar.cc/150?u=ananya',
    },
  });

  // 2. Create the Counselor Profile
  await prisma.counselorProfile.upsert({
    where: { userId: counselorUser.id },
    update: {},
    create: {
      userId: counselorUser.id,
      bio: 'Ex-Google Product Manager | Career Coach for Tech & Management',
      specializations: ['Technology', 'Product Management', 'MBA'],
      experience: 10,
      isApproved: true,
      isAvailable: true,
      sessionRateInr: 1500,
    },
  });

  console.log('Counselor seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

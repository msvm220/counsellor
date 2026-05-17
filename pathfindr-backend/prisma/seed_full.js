require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start full seeding...');

  // Clean existing data
  console.log('Cleaning existing data...');
  await prisma.resource.deleteMany();
  await prisma.career.deleteMany();
  await prisma.counselorProfile.deleteMany();
  // Don't delete users to avoid locking ourselves out, but we might want to clear test ones
  
  // 1. Seed Counseling Domains (repusing Career model for now)
  console.log('Seeding Counseling Domains...');
  const domains = [
    {
      name: 'Career Strategy',
      slug: 'career-strategy',
      description: 'Find your professional true north and master the job market.',
      category: 'Career',
      educationPath: ['Assessment', 'Market Mapping', 'Expert Connect'],
      difficultyLevel: 3,
    },
    {
      name: 'Love & Relationships',
      slug: 'love-relationships',
      description: 'Navigate dating, marriage, and family dynamics with expert guidance.',
      category: 'Personal',
      educationPath: ['Compatibility Check', 'Communication Skills', 'Counseling'],
      difficultyLevel: 2,
    },
    {
      name: 'Wealth & Finance',
      slug: 'wealth-finance',
      description: 'Master your money, from debt management to investment strategies.',
      category: 'Finance',
      educationPath: ['Audit', 'Goal Setting', 'Portfolio Mapping'],
      difficultyLevel: 4,
    }
  ];

  for (const d of domains) {
    await prisma.career.upsert({
      where: { slug: d.slug },
      update: d,
      create: d,
    });
  }

  // 2. Seed Resources
  console.log('Seeding Resources...');
  const resources = [
    {
      title: 'The Art of Modern Dating',
      type: 'ARTICLE',
      url: 'https://example.com/dating',
      tags: ['Love', 'Relationships'],
    },
    {
      title: 'Wealth Building for Gen Z',
      type: 'VIDEO',
      url: 'https://youtube.com/watch?v=example2',
      tags: ['Finance', 'Wealth'],
    }
  ];

  for (const r of resources) {
    await prisma.resource.create({ data: r });
  }

  console.log('Full seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

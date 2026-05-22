require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const counselors = [
  {
    email: 'ananya@pathfindr.com',
    name: 'Dr. Ananya Sharma',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    bio: 'Ex-Google Product Manager | Career Coach for Tech & Management professionals with 10+ years of industry experience.',
    specializations: ['Career', 'Technology', 'MBA'],
    experience: 10,
    sessionRateInr: 1500,
  },
  {
    email: 'rajesh@pathfindr.com',
    name: 'Dr. Rajesh Kumar',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    bio: 'Certified Financial Planner & Wealth Coach. Helped 500+ families achieve financial freedom through smart investment strategies.',
    specializations: ['Wealth', 'Finance', 'Legal'],
    experience: 15,
    sessionRateInr: 1200,
  },
  {
    email: 'priya@pathfindr.com',
    name: 'Dr. Priya Nair',
    avatarUrl: 'https://i.pravatar.cc/150?img=45',
    bio: 'Relationship Therapist & Marriage Counselor. Specializes in pre-marital guidance, couples therapy, and family dynamics.',
    specializations: ['Marriage', 'Relationships', 'Parents'],
    experience: 12,
    sessionRateInr: 1000,
  },
  {
    email: 'vikram@pathfindr.com',
    name: 'Dr. Vikram Singh',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    bio: 'Holistic Health Coach & Wellness Expert. Combines Ayurveda and modern medicine for comprehensive health guidance.',
    specializations: ['Health', 'Remedies', 'Wellness'],
    experience: 8,
    sessionRateInr: 900,
  },
  {
    email: 'meera@pathfindr.com',
    name: 'Adv. Meera Krishnan',
    avatarUrl: 'https://i.pravatar.cc/150?img=36',
    bio: 'Senior Advocate & Legal Advisor. Expert in family law, property disputes, and business legal counsel.',
    specializations: ['Legal', 'Finance', 'Career'],
    experience: 18,
    sessionRateInr: 2000,
  },
];

async function main() {
  console.log('Seeding counselors with hashed passwords...');

  const passwordHash = await bcrypt.hash('Pathfindr@123', 12);

  for (const c of counselors) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {
        name: c.name,
        avatarUrl: c.avatarUrl,
        role: 'COUNSELOR',
      },
      create: {
        email: c.email,
        passwordHash,
        name: c.name,
        role: 'COUNSELOR',
        avatarUrl: c.avatarUrl,
        isActive: true,
      },
    });

    await prisma.counselorProfile.upsert({
      where: { userId: user.id },
      update: {
        bio: c.bio,
        specializations: c.specializations,
        experience: c.experience,
        sessionRateInr: c.sessionRateInr,
        isApproved: true,
        isAvailable: true,
      },
      create: {
        userId: user.id,
        bio: c.bio,
        specializations: c.specializations,
        experience: c.experience,
        sessionRateInr: c.sessionRateInr,
        isApproved: true,
        isAvailable: true,
        languages: ['English', 'Hindi'],
      },
    });

    console.log(`✓ Seeded: ${c.name} (${c.email})`);
  }

  console.log('\n✅ All counselors seeded! Login password: Pathfindr@123');
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

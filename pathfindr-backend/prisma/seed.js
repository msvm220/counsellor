require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding career questions...');

  // First, clean existing questions to avoid duplicates
  await prisma.assessmentQuestion.deleteMany();

  const questions = [
    {
      questionText: 'How much do you enjoy solving complex mathematical or logical puzzles?',
      category: 'interest',
      questionType: 'MCQ',
      orderIndex: 1,
      options: [
        { label: 'Not at all', value: 1 },
        { label: 'Slightly', value: 2 },
        { label: 'Moderately', value: 3 },
        { label: 'Very much', value: 4 },
        { label: 'It is my passion', value: 5 },
      ],
    },
    {
      questionText: 'Do you prefer working alone on a project or as part of a large team?',
      category: 'personality',
      questionType: 'MCQ',
      orderIndex: 2,
      options: [
        { label: 'Exclusively alone', value: 1 },
        { label: 'Mostly alone', value: 2 },
        { label: 'Balanced', value: 3 },
        { label: 'Mostly team', value: 4 },
        { label: 'Exclusively team', value: 5 },
      ],
    },
    {
      questionText: 'How comfortable are you with public speaking or presenting ideas to a crowd?',
      category: 'aptitude',
      questionType: 'MCQ',
      orderIndex: 3,
      options: [
        { label: 'Terrified', value: 1 },
        { label: 'Uncomfortable', value: 2 },
        { label: 'Manageable', value: 3 },
        { label: 'Confident', value: 4 },
        { label: 'Love it', value: 5 },
      ],
    },
    {
      questionText: 'Do you enjoy creative tasks like writing, painting, or designing?',
      category: 'interest',
      questionType: 'MCQ',
      orderIndex: 4,
      options: [
        { label: 'Not at all', value: 1 },
        { label: 'Rarely', value: 2 },
        { label: 'Sometimes', value: 3 },
        { label: 'Often', value: 4 },
        { label: 'Constantly', value: 5 },
      ],
    },
    {
      questionText: 'How do you handle high-pressure situations or tight deadlines?',
      category: 'personality',
      questionType: 'MCQ',
      orderIndex: 5,
      options: [
        { label: 'I panic', value: 1 },
        { label: 'Get stressed', value: 2 },
        { label: 'Stay neutral', value: 3 },
        { label: 'Stay focused', value: 4 },
        { label: 'Thrive on it', value: 5 },
      ],
    },
    {
      questionText: 'How proficient are you at learning new software or technical tools?',
      category: 'aptitude',
      questionType: 'MCQ',
      orderIndex: 6,
      options: [
        { label: 'Very slow', value: 1 },
        { label: 'Slow', value: 2 },
        { label: 'Average', value: 3 },
        { label: 'Fast', value: 4 },
        { label: 'Immediate', value: 5 },
      ],
    },
    {
      questionText: 'Do you prefer following a set routine or having a dynamic, unpredictable schedule?',
      category: 'personality',
      questionType: 'MCQ',
      orderIndex: 7,
      options: [
        { label: 'Strict routine', value: 1 },
        { label: 'Mostly routine', value: 2 },
        { label: 'Flexible', value: 3 },
        { label: 'Mostly dynamic', value: 4 },
        { label: 'Purely dynamic', value: 5 },
      ],
    },
    {
      questionText: 'How interested are you in leadership roles and managing other people?',
      category: 'interest',
      questionType: 'MCQ',
      orderIndex: 8,
      options: [
        { label: 'Not at all', value: 1 },
        { label: 'Low interest', value: 2 },
        { label: 'Neutral', value: 3 },
        { label: 'Interested', value: 4 },
        { label: 'Highly motivated', value: 5 },
      ],
    },
    {
      questionText: 'Are you more interested in abstract theories or practical, hands-on applications?',
      category: 'values',
      questionType: 'MCQ',
      orderIndex: 9,
      options: [
        { label: 'Purely theory', value: 1 },
        { label: 'Mostly theory', value: 2 },
        { label: 'Balanced', value: 3 },
        { label: 'Mostly practical', value: 4 },
        { label: 'Purely practical', value: 5 },
      ],
    },
    {
      questionText: 'How much do you value financial stability over creative freedom in a career?',
      category: 'values',
      questionType: 'MCQ',
      orderIndex: 10,
      options: [
        { label: 'Freedom only', value: 1 },
        { label: 'Freedom mostly', value: 2 },
        { label: 'Equal value', value: 3 },
        { label: 'Stability mostly', value: 4 },
        { label: 'Stability only', value: 5 },
      ],
    },
  ];

  for (const q of questions) {
    const question = await prisma.assessmentQuestion.create({
      data: q,
    });
    console.log(`Created question: ${question.questionText}`);
  }

  console.log('Seeding finished.');
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

require('dotenv').config();
const prisma = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function testCreateUser() {
  try {
    console.log('Attempting to create test user...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test_${Date.now()}@example.com`,
        passwordHash,
        role: 'STUDENT',
      }
    });
    console.log('User created successfully:', user.id);
    
    // Create profile
    await prisma.studentProfile.create({
      data: { userId: user.id }
    });
    console.log('Profile created successfully!');
    
  } catch (err) {
    console.error('Failed to create user:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateUser();

require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('Testing connection to:', process.env.DATABASE_URL);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
  });

  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful!', res.rows[0]);
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();

const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_NAME || 'FoodDash Admin';

  if (!email || !password || password.length < 8) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env. Password must be at least 8 characters.');
  }

  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 10));
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await connection.execute(
    `INSERT INTO admins (email, password_hash, full_name, role, is_active)
     VALUES (?, ?, ?, 'admin', TRUE)
     ON DUPLICATE KEY UPDATE
      password_hash = VALUES(password_hash),
      full_name = VALUES(full_name),
      is_active = TRUE`,
    [email, passwordHash, fullName]
  );

  await connection.end();
  console.log(`Admin account is ready: ${email}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

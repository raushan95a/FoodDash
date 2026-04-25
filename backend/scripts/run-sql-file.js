const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node scripts/run-sql-file.js <path-to-sql-file>');
  process.exit(1);
}

function parseStatements(sql) {
  const statements = [];
  const lines = sql.split(/\r?\n/);
  let delimiter = ';';
  let buffer = '';

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.toUpperCase().startsWith('DELIMITER ')) {
      delimiter = trimmed.slice('DELIMITER '.length);
      continue;
    }

    buffer += `${line}\n`;

    if (buffer.trimEnd().endsWith(delimiter)) {
      const endIndex = buffer.lastIndexOf(delimiter);
      const statement = buffer.slice(0, endIndex).trim();
      if (statement) {
        statements.push(statement);
      }
      buffer = '';
    }
  }

  const rest = buffer.trim();
  if (rest) {
    statements.push(rest);
  }

  return statements;
}

async function main() {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const sql = fs.readFileSync(absolutePath, 'utf8');
  const statements = parseStatements(sql);

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: false
  });

  for (const statement of statements) {
    await connection.query(statement);
  }

  await connection.end();
  console.log(`Executed ${statements.length} SQL statements from ${filePath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

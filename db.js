import postgres from 'postgres';
import 'dotenv/config';


const { DATABASE_URL } = process.env;
console.log(DATABASE_URL);

if (!DATABASE_URL) {
  console.error('DATABASE_URL não está definida.');
  process.exit(1);
}

export const sql = postgres(DATABASE_URL, { ssl: 'require' });

import postgres from 'postgres';
import 'dotenv/config'; // Carrega as variáveis do .env

const { DATABASE_URL } = process.env;

// Verifica se a variável DATABASE_URL está definida
if (!DATABASE_URL) {
  console.error('DATABASE_URL não está definida.');
  process.exit(1); // Encerra o processo se faltar a variável
}

// Conexão com o banco usando a DATABASE_URL
export const sql = postgres(DATABASE_URL, { ssl: 'require' });

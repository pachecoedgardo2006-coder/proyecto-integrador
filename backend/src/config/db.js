import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD || ''),
  port: Number(process.env.DB_PORT) || 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conexión exitosa a PostgreSQL:', res.rows[0].now);
  }
});

// Hacemos que dbQuery devuelva el objeto result completo, para no romper tus controladores existentes
export const dbQuery = async (query, params = []) => {
  const result = await pool.query(query, params);
  return result; // Retorna el objeto completo de pg (con .rows, .rowCount, etc.)
};

export const dbRun = async (query, params = []) => {
  const result = await pool.query(query, params);
  
  const firstRow = result.rows[0];
  const returnedId = firstRow ? Object.values(firstRow)[0] : undefined;

  return {
    id: returnedId,
    changes: result.rowCount,
  };
};

export const db = pool;
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conexión exitosa a PostgreSQL:', res.rows[0].now);
  }
});

const dbQuery = async (query, params = []) => {
  const result = await pool.query(query, params);
  return result.rows;
};

const dbRun = async (query, params = []) => {
  const result = await pool.query(query, params);
  return {
    id: result.rows[0]?.id,
    changes: result.rowCount,
  };
};

module.exports = {
  db: pool,
  dbQuery,
  dbRun,
};
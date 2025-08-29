import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db', 
  database: process.env.POSTGRES_DB || 'logdb',
  password: process.env.POSTGRES_PASSWORD || 'password',
  port: 5432,
});

// Health check
app.get('/', (req, res) => res.send('Backend is running'));

// Example route
app.get('/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM logs');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

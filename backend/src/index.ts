import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Health check
app.get('/', (req, res) => res.send('Backend is running'));

app.post("/ingest", async (req, res) => {
  const logs = Array.isArray(req.body) ? req.body : [req.body];

  if (logs.length === 0) return res.json({ status: "ok", inserted: 0 });

  // เตรียมค่าที่จะ insert
  const values: (string | null)[] = [];
  const placeholders = logs.map((log, i) => {
    const idx = i * 8;

    // สร้าง raw แบบสั้น ๆ เฉพาะ os/browser
    const shortRaw = log.raw?.raw ? { os: log.raw.raw.os, browser: log.raw.raw.browser } : null;

    values.push(
      log.timestamp || log["@timestamp"] || null,
      log.source || null,
      log.event_type || null,
      log.username || log.user || null,
      log.ip || null,
      log.action || null,
      JSON.stringify(shortRaw), // เก็บเฉพาะ os/browser
      log.tenant || null
    );

    return `($${idx + 1},$${idx + 2},$${idx + 3},$${idx + 4},$${idx + 5},$${idx + 6},$${idx + 7},$${idx + 8})`;
  }).join(",");

  try {
    await pool.query(
      `INSERT INTO logs (timestamp, source, event_type, username, ip, action, raw, tenant)
       VALUES ${placeholders}`,
      values
    );
    res.json({ status: "ok", inserted: logs.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Insert error");
  }
});

// ลบ log ตาม id
app.delete('/logs/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).send('Invalid id');

  try {
    const result = await pool.query('DELETE FROM logs WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ status: 'not found' });
    }

    res.json({ status: 'ok', deleted: result.rowCount, log: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete error');
  }
});

// ลบ log ทั้งหมด
app.delete('/logs', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM logs');
    res.json({ status: 'ok', deleted: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete error');
  }
});


// Route ดู logs
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

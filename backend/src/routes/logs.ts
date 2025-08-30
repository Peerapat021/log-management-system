import { Router } from 'express';
import { pool } from '../db';
import { normalizeLog } from '../utils/normalize';

const router = Router();

// POST /ingest
router.post('/', async (req, res) => {
  const logs = Array.isArray(req.body) ? req.body : [req.body];
  if (!logs.length) return res.json({ status: 'ok', inserted: 0 });

  const values: any[] = [];
  const placeholders = logs.map((log, i) => {
    const n = normalizeLog(log);
    const idx = i * 8;
    values.push(n.timestamp, n.source, n.event_type, n.username, n.ip, n.action, JSON.stringify(n.raw), n.tenant);
    return `($${idx + 1},$${idx + 2},$${idx + 3},$${idx + 4},$${idx + 5},$${idx + 6},$${idx + 7},$${idx + 8})`;
  }).join(',');

  try {
    await pool.query(`INSERT INTO logs (timestamp, source, event_type, username, ip, action, raw, tenant) VALUES ${placeholders}`, values);
    res.json({ status: 'ok', inserted: logs.length });
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert error');
  }
});

// GET /logs with filter
router.get('/', async (req, res) => {
  const { tenant, event_type, start, end } = req.query;
  const conditions: string[] = [];
  const values: any[] = [];

  if (tenant) { values.push(tenant); conditions.push(`tenant = $${values.length}`); }
  if (event_type) { values.push(event_type); conditions.push(`event_type = $${values.length}`); }
  if (start) { values.push(start); conditions.push(`timestamp >= $${values.length}`); }
  if (end) { values.push(end); conditions.push(`timestamp <= $${values.length}`); }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  try {
    const result = await pool.query(`SELECT * FROM logs ${whereClause} ORDER BY timestamp DESC`, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;

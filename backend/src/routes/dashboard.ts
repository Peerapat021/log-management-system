import { Router } from 'express';
import { pool } from '../db';

const router = Router();

// GET /logs/top?field=event_type&limit=5
router.get('/top', async (req, res) => {
  const field = req.query.field || 'event_type';
  const limit = parseInt(req.query.limit as string) || 5;

  try {
    const result = await pool.query(
      `SELECT ${field}, COUNT(*) AS count
       FROM logs
       GROUP BY ${field}
       ORDER BY count DESC
       LIMIT $1`,
      [limit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /logs/timeline?interval=hour
router.get('/timeline', async (req, res) => {
  const interval = req.query.interval === 'day' ? 'day' : 'hour';

  try {
    const result = await pool.query(
      `SELECT date_trunc($1, timestamp) AS period, COUNT(*) AS count
       FROM logs
       GROUP BY period
       ORDER BY period ASC`,
      [interval]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;

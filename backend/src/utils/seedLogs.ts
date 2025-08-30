import fs from 'fs';
import { Pool } from 'pg';
import { normalizeLog } from './normalize';

const pool = new Pool({ /* config */ });
const sampleLogs = JSON.parse(fs.readFileSync('./samples/sample_logs.json', 'utf8'));

async function seed() {
  for (const log of sampleLogs) {
    const n = normalizeLog(log);
    await pool.query(
      `INSERT INTO logs (timestamp, source, event_type, username, ip, action, raw, tenant)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [n.timestamp, n.source, n.event_type, n.username, n.ip, n.action, JSON.stringify(n.raw), n.tenant]
    );
  }
  console.log('Seed completed');
  process.exit(0);
}

seed();

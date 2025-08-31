// lib/api.ts
import { Log } from "../app/types/log";

export async function fetchLogs(params?: Record<string, string>) {
  const query = params
    ? '?' + new URLSearchParams(params).toString()
    : '';
  const res = await fetch(`http://localhost:4000/logs${query}`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

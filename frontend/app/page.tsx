"use client";
import { useEffect, useState } from "react";

interface Log {
  id: string;           // หรือ number ตาม backend
  timestamp: string;
  tenant: string;
  source: string;
  user_name: string;
  event_type: string;
}

export default function Page() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/logs")
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div>
      <h1>Log Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Time</th><th>Tenant</th><th>Source</th><th>User</th><th>Event</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l: Log) => (
            <tr key={l.id}>
              <td>{l.timestamp}</td>
              <td>{l.tenant}</td>
              <td>{l.source}</td>
              <td>{l.user_name}</td>
              <td>{l.event_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

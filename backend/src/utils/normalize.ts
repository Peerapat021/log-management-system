export function normalizeLog(log: any) {
  let timestamp = log.timestamp || log["@timestamp"] || log.time || new Date().toISOString();
  let source = log.source || log.src || null;
  let event_type = log.event_type || log.type || null;
  let username = log.username || log.user || null;
  let ip = log.ip || log.ip_address || null;
  let action = log.action || null;
  let tenant = log.tenant || "default";

  // ตัวอย่างปรับตามแหล่งเฉพาะ (optional)
  if (log.syslog_facility) {
    // แหล่ง syslog
    event_type = log.type || event_type;
    source = log.src || source;
  }

  if (log.batch_file) {
    // แหล่ง batch file
    source = log.source || source;
    timestamp = log.timestamp || timestamp;
  }

  if (log.simulator) {
    // แหล่ง simulator
    timestamp = log.time || timestamp;
  }

  return {
    timestamp,
    source,
    event_type,
    username,
    ip,
    action,
    raw: log,
    tenant,
  };
}

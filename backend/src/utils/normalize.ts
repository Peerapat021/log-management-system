

export function normalizeLog(log: any) {
  return {
    timestamp: log.timestamp || log["@timestamp"] || log.time || new Date().toISOString(),
    source: log.source || log.src || null,
    event_type: log.event_type || log.type || null,
    username: log.username || log.user || null,
    ip: log.ip || log.ip_address || null,
    action: log.action || null,
    raw: log.raw || null,
    tenant: log.tenant || "default"
  };
}

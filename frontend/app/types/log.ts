// types/log.ts
export interface Log {
  id: number;
  timestamp: string;
  source: string | null;
  event_type: string | null;
  username: string | null;
  ip: string | null;
  action: string | null;
  tenant: string;
}

import { Cfg } from 'src/config/cfg-keys';

export function envInt(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return defaultValue;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : defaultValue;
}

export function envTrustProxy(): boolean | number | undefined {
  const v = process.env[Cfg.trustProxy];
  if (v === undefined || v === '') return undefined;
  const lower = v.toLowerCase();
  if (v === '0' || lower === 'false' || lower === 'no') return undefined;
  if (v === '1') return 1;
  if (lower === 'true' || lower === 'yes') return true;
  const n = Number.parseInt(v, 10);
  if (Number.isFinite(n) && n >= 0) return n;
  return undefined;
}

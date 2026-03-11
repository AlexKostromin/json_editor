// ========== Base64 ==========
export function base64Encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

export function base64Decode(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

// ========== URL encode/decode ==========
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

// ========== Unix Timestamp ==========
export function timestampToDate(ts: string): string {
  const num = Number(ts.trim());
  if (isNaN(num)) throw new Error('Невалидный timestamp');
  // auto-detect seconds vs milliseconds
  const ms = num > 1e12 ? num : num * 1000;
  const d = new Date(ms);
  return JSON.stringify({
    utc: d.toUTCString(),
    local: d.toLocaleString('ru-RU'),
    iso: d.toISOString(),
    timestamp_sec: Math.floor(ms / 1000),
    timestamp_ms: ms,
  }, null, 2);
}

export function dateToTimestamp(): string {
  const now = new Date();
  return JSON.stringify({
    now_utc: now.toUTCString(),
    now_local: now.toLocaleString('ru-RU'),
    now_iso: now.toISOString(),
    timestamp_sec: Math.floor(now.getTime() / 1000),
    timestamp_ms: now.getTime(),
  }, null, 2);
}

// ========== UUID ==========
export function generateUUIDs(count: number = 5): string[] {
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(crypto.randomUUID());
  }
  return uuids;
}

// ========== JWT ==========
export function decodeJwt(token: string): { header: Record<string, unknown>; payload: Record<string, unknown>; signature: string } {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('Невалидный JWT: должно быть 3 части');

  const decodeBase64 = (part: string) => {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    return JSON.parse(atob(padded));
  };

  const header = decodeBase64(parts[0]);
  const payload = decodeBase64(parts[1]);

  const timeFields = ['exp', 'iat', 'nbf'];
  for (const field of timeFields) {
    if (typeof payload[field] === 'number') {
      payload[`${field}_readable`] = new Date(payload[field] * 1000).toLocaleString('ru-RU');
    }
  }

  return { header, payload, signature: parts[2] };
}